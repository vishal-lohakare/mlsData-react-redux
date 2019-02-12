import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

export default class AddContextVarModal extends React.Component {

  render() {
    const { isAddModalOpen, hideAddModal, copyContextMetadataType, handleAddNewContextName,
            contextVariableName, copyContextSelectedValue, disableAddNewContextButton, onAddNewContextVariable
          } = this.props;
    return (
      <div>
        <Modal isOpen={isAddModalOpen} toggle={hideAddModal} className="customModal">
          <ModalHeader toggle={hideAddModal}>Add New Context Variable</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Metadata Type</Label>
              <Input value={copyContextMetadataType} disabled readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Context Variable Name</Label>
              <Input
                id="contextVariableName"
                name="contextVariableName"
                onChange={handleAddNewContextName}
                value={contextVariableName}
              />
            </FormGroup>
            <FormGroup>
              <Label>Context Variable Value</Label>
              <Input
                id="contextVariableValue"
                name="contextVariableValue"
                value={copyContextSelectedValue}
                readOnly
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={onAddNewContextVariable}
              disabled={disableAddNewContextButton}>
              Save
          </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
