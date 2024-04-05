import Button from '@/components/ui/button';
import { useModalAction } from '@/components/ui/modal/modal.context';


export default function JoinButton() {

  const { openModal } = useModalAction();
  function handleJoin() {
    return openModal('LOGIN_VIEW');
  }
  return (
    <Button className="font-semibold" size="small" onClick={handleJoin}>
      Join
    </Button>
  );
}
