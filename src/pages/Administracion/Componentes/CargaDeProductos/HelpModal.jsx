import { Button, Modal } from 'antd'
import React from 'react'
import Markdown from 'react-markdown'
function HelpModal({closeModal, helpText}) {
  const textDescription = `
  ## **Guía rápida de Markdown para descripciones**

  Puedes usar los siguientes elementos para crear descripciones más atractivas para tus productos:

  ### 1. **Títulos**

  Puedes agregar títulos para dividir la descripción en secciones:

  \`\`\`markdown
  ## Título de la sección
  \`\`\`

  Ejemplo:

  ## Características del producto

  ### 2. **Listas**

  Usa listas para mostrar características o detalles importantes:

  \`\`\`markdown
  - Característica 1
  - Característica 2
  - Característica 3
  \`\`\`

  Ejemplo:

  - Hecho a mano
  - Material resistente
  - Disponible en varios colores

  ### 3. **Texto en negrita**

  Resalta información importante con **negrita**:

  \`\`\`markdown
  **Texto destacado**
  \`\`\`

  Ejemplo:

  **Material**: Cuero genuino.
  `;

  const helpCategory = `
## **¿Para qué me sirven las categorías?**

- *Las categorías ayudan a que tus clientes puedan filtrar tus productos. Si tienes muchos productos de diferentes tipos, añadir categorías les ayudará a encontrar más rápido lo que buscan.*
- *Añadir una categoría es muy simple, piensa un momento en que tipos de productos tienes, y luego ve añadiendolos desde aquí*
`;
  return (
    <>
    <Modal
    open={true}
    closeIcon={false}
    footer={[
        <Button type='primary' onClick={()=> closeModal()}>Entendido</Button>
    ]}
    >
        <Markdown>{helpText.trim() === "category" ? helpCategory :textDescription }</Markdown>

    </Modal>
    </>
  )
}

export default HelpModal