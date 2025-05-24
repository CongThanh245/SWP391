// src/components/common/Button/Button.jsx
import React from 'react';
import styles from '../Button/Button.module.css'; // ✅ styles.buttonClassName
import classNames from 'classnames';

function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={classNames(styles.button, {
        [styles.primary]: variant === 'primary',
        [styles.secondary]: variant === 'secondary',
      })}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;