import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  operation: Function;
}
function AddButton({ operation }: Props) {
  return (
    <button className="tag add" onClick={() => operation()}>
      <FontAwesomeIcon icon={faPlus} color="green" size="xl" />
    </button>
  );
}

export default AddButton;
