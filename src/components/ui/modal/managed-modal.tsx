import Modal from '@/components/ui/modal/modal';
import { useModalAction, useModalState } from './modal.context';
import FinalizeSelection from '@/components/allModals/FinalizeSelection';
import ProjectSaved from '@/components/allModals/ProjectSaved';

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'FINALIZE_SELECTION' && <FinalizeSelection />}
      {view === 'PROJECT_SAVED' && <ProjectSaved />}

    </Modal>
  );
};

export default ManagedModal;
