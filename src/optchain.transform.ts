import * as ts from 'typescript';
import { Node, Program, SourceFile, TransformationContext } from 'typescript';

ts;

const TSOC_ANY_SYMBOL = 'TSOCAny';
const TSOC_DATA_ACCESSOR_SYMBOL = 'TSOCDataAccessor';
const TSOC_TYPE_SYMBOL = 'TSOCType';

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return context => file => visitNodeAndChildren(file, program, context);
}

function visitNodeAndChildren(
  node: Node,
  program: Program,
  context: TransformationContext
): SourceFile {
  return ts.visitEachChild(
    visitNode(node, program),
    child => visitNodeAndChildren(child, program, context),
    context
  ) as SourceFile;
}

function isOptChain(node: ts.Node): node is ts.ConditionalExpression {
  if (node.kind !== ts.SyntaxKind.ConditionalExpression) {
    return false;
  }

  const { whenTrue, whenFalse, colonToken } = node as ts.ConditionalExpression;
  // optional chaining operator is basically a ternary without colon and false condition
  return whenFalse.pos === whenFalse.end && colonToken.pos === colonToken.end;
}

function createAccess(parent: ts.Expression, node: ts.Expression): ts.Expression {
  return ts.isIdentifier(node)
    ? ts.createPropertyAccess(parent, node)
    : ts.createElementAccess(parent, node);
}

function processOptChain(node: ts.ConditionalExpression): ts.ConditionalExpression {
  let accessExpression: ts.Expression = ts.createPropertyAccess(node.condition, node.whenTrue);
  let condition = ts.createBinary(node, ts.SyntaxKind.ExclamationEqualsToken, ts.createNull());

  return ts.createConditional(condition, accessExpression, ts.createIdentifier('undefined'));
}

function opt(base: ts.Expression, rest: ts.Expression): ts.Expression {
  let access: ts.Expression = ts.createNull();
  let node = rest;
  let other: ts.Expression = ts.createIdentifier('undefined');
  if (ts.isConditionalExpression(rest)) {
    node = rest.condition;
    if (rest.whenTrue) {
      other = opt(node, rest.whenTrue);
    }
  }
  if (ts.isElementAccessExpression(node)) {
    access = ts.createElementAccess(
      ts.createPropertyAccess(base, node.expression.name),
      node.argumentExpression
    );
  } else if (ts.isPropertyAccessExpression(node)) {
    access = ts.createPropertyAccess(ts.createPropertyAccess(base, node.expression), node.name);
  } else if (ts.isCallExpression(node)) {
    access = ts.createCall(
      ts.createPropertyAccess(base, node.expression),
      node.typeArguments,
      node.arguments
    );
  }
  //console.log(base.getText(), access.getText(), !ts.isIdentifier(other) && other.getText());
  return ts.createConditional(base, access, other);
}

function visitNode(node: ts.Node, program: ts.Program): ts.Node {
  const typeChecker = program.getTypeChecker();
  if (isOptChain(node)) {
    //console.log(node.condition.getText(), node.whenTrue.getText());
    return opt(node.condition, node.whenTrue);
  }

  // if (node.getText() == '?') {
  //   console.log(node.getText(), node.parent.whenTrue.getText());
  // }

  // if (ts.isCallExpression(node)) {
  //   // Check if function call expression is an oc chain, e.g.,
  //   //   oc(x).y.z()
  //   if (
  //     _isValidOCType(typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node.expression)))
  //   ) {
  //     // We found an OCType data accessor call
  //     if (!node.arguments.length) {
  //       // No default value argument: replace CallExpression node with child expression
  //       return _expandOCExpression(node.expression);
  //     }

  //     // Default argument is provided: replace CallExpression with child expression OR default
  //     return _expandOCExpression(node.expression, node.arguments[0]);
  //   } else if (node.arguments.length) {
  //     // Check for a naked oc(x) call
  //     const callTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
  //     if (_isValidOCType(callTypeNode)) {
  //       // Unwrap oc(x) -> x
  //       return node.arguments[0];
  //     }
  //   }
  // } else if (ts.isPropertyAccessExpression(node)) {
  //   const expressionTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
  //   if (_isValidOCType(expressionTypeNode)) {
  //     // We found an OCType property access expression w/o closing de-reference, e.g.,
  //     //   oc(x).y.z
  //     return _expandOCExpression(node);
  //   }
  // }

  return node;
}

function _isValidOCType(node: ts.TypeNode | undefined): boolean {
  if (!node) {
    return false;
  }

  // Check recursively if we're dealing with a union or intersection type
  if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
    return node.types.some(n => _isValidOCType(n));
  }

  if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
    return (
      node.typeName.escapedText === TSOC_ANY_SYMBOL ||
      node.typeName.escapedText === TSOC_DATA_ACCESSOR_SYMBOL ||
      node.typeName.escapedText === TSOC_TYPE_SYMBOL
    );
  }

  return false;
}

function _expandOCExpression(expression: ts.Expression): ts.Expression {
  // Transform an OC expression from:
  //   a?.b?[1]?.c
  // To:
  //   (a != null && a.b != null && a.b[1] != null && a.b[1].c != null) ? a.b[1].c : undefined

  let subExpression: ts.Expression | null = null;
  const nodeStack: ts.Expression[] = [];
  const _walkExpression = (n: ts.Expression): void => {
    console.log(n.getText());
    if (ts.isConditionalExpression(n) && n.whenFalse.pos === n.whenFalse.end) {
      _walkExpression(n.condition);
      _walkExpression(n.whenTrue);
    } else if (ts.isCallExpression(n)) {
      nodeStack.unshift(n);
      n.getChildren().forEach(_walkExpression);
    } else {
      subExpression = n;
    }
  };
  _walkExpression(expression);

  if (!subExpression) {
    throw new Error(
      `Could not find valid root node for ${TSOC_TYPE_SYMBOL} expression: "${expression.getText()}"`
    );
  }

  const last = nodeStack.pop();
  let condition: ts.Expression = ts.createBinary(
    subExpression,
    ts.SyntaxKind.ExclamationEqualsToken,
    ts.createNull()
  );
  for (const next of nodeStack) {
    subExpression = ts.isIdentifier(next)
      ? ts.createPropertyAccess(subExpression, next)
      : ts.createElementAccess(subExpression, next);
    condition = ts.createLogicalAnd(
      condition,
      ts.createBinary(subExpression, ts.SyntaxKind.ExclamationEqualsToken, ts.createNull())
    );
  }

  if (ts.isIdentifier(last)) {
    subExpression = ts.createPropertyAccess(subExpression, last);
  } else if (ts.isCallExpression(last)) {
    last.expression = subExpression as ts.LeftHandSideExpression;
    subExpression = last;
  } else {
    subExpression = ts.createElementAccess(subExpression, last);
  }
  return ts.createConditional(condition, subExpression, ts.createIdentifier('undefined'));
}
