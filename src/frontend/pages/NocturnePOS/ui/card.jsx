import React from "react";

export const Card = ({ className = '', children, style, ...props }) => (
  <div
    className={`card ${className}`}
    style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, style, ...props }) => (
  <div
    className={`card-header ${className}`}
    style={{
      padding: '1.5rem',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, style, ...props }) => (
  <h3
    className={`card-title ${className}`}
    style={{
      fontSize: '1.125rem',
      fontWeight: '600',
      margin: 0,
      ...style
    }}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ className = '', children, style, ...props }) => (
  <div
    className={`card-content ${className}`}
    style={{
      padding: '0 1.5rem 1.5rem 1.5rem',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardDescription = ({ className = '', children, style, ...props }) => (
  <p
    className={`card-description ${className}`}
    style={{
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.5rem',
      ...style
    }}
    {...props}
  >
    {children}
  </p>
);

export const CardFooter = ({ className = '', children, style, ...props }) => (
  <div
    className={`card-footer ${className}`}
    style={{
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e2e8f0',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
);
