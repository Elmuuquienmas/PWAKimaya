// En el celular el observer a veces no avisa y el texto se quedaba invisible.
export function Reveal({ as: Tag = 'div', className = '', children }) {
  return <Tag className={className}>{children}</Tag>
}
