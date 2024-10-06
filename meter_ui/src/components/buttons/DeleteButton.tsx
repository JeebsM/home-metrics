import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  operation: CallableFunction;
}
function DeleteButton({ operation }: Props) {
  return (
    <button className="tag delete" onClick={() => operation()}>
      <FontAwesomeIcon icon={faMinus} color="red" size="xl" />
    </button>
  );
}

export default DeleteButton;
