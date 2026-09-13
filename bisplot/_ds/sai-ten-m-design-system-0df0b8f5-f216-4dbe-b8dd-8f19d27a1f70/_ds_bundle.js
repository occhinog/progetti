/* @ds-bundle: {"format":4,"namespace":"SAITENMDesignSystem_0df0b8","components":[{"name":"Button","sourcePath":"components/form/Button.jsx"},{"name":"Input","sourcePath":"components/form/Input.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"}],"sourceHashes":{"components/form/Button.jsx":"5a781cc2c004","components/form/Input.jsx":"927bfac59b31","components/layout/Card.jsx":"fd2e688b79b7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SAITENMDesignSystem_0df0b8 = window.SAITENMDesignSystem_0df0b8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/form/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary interaction element
 * @startingPoint section="Form Controls" subtitle="Primary call-to-action button" viewport="200x44"
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms ease',
    opacity: disabled ? 0.6 : 1
  };
  const sizeStyles = {
    sm: {
      fontSize: '14px',
      padding: '8px 16px',
      minHeight: '32px'
    },
    md: {
      fontSize: '16px',
      padding: '12px 24px',
      minHeight: '44px'
    },
    lg: {
      fontSize: '18px',
      padding: '16px 32px',
      minHeight: '52px'
    }
  };
  const variantStyles = {
    primary: {
      background: 'var(--color-primary)',
      color: '#fff',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'var(--color-gray-2)',
      color: 'var(--color-text-primary)',
      boxShadow: 'var(--shadow-sm)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    },
    disabled: disabled,
    onClick: onClick
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Button.jsx", error: String((e && e.message) || e) }); }

// components/form/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — text field
 */
function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    disabled: disabled,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      padding: '12px 16px',
      border: error ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: disabled ? 'var(--color-gray-1)' : '#fff',
      color: 'var(--color-text-primary)',
      cursor: disabled ? 'not-allowed' : 'text',
      transition: 'border-color 200ms ease',
      minHeight: '44px',
      boxSizing: 'border-box'
    }
  }, props));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Input.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — container for grouped content
 */
function Card({
  children,
  padding = 'md',
  shadow = 'md',
  ...props
}) {
  const paddingMap = {
    sm: '16px',
    md: '24px',
    lg: '32px'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: paddingMap[padding],
      boxShadow: `var(--shadow-${shadow})`,
      border: '1px solid var(--color-border-light)'
    }
  }, props), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Card = __ds_scope.Card;

})();
