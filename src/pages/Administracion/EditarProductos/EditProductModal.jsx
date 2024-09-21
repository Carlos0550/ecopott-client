import { Button, Modal } from 'antd'
import React from 'react'
import AddProducts from '../Componentes/CargaDeProductos/AddProducts'

function EditProductModal({closeModal,product, productImages}) {
  return (
    <>
        <Modal
            open={true}
            footer={[
                <Button onClick={()=> closeModal()}>Cancelar</Button>
            ]}
            onCancel={()=> closeModal()}
        >
            <AddProducts editing={true} product={product} productImages={productImages} closeModal={()=>closeModal()}/>
        </Modal>
    </>
  )
}

export default EditProductModal