import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  value: any;
  icon: IconDefinition;
}
function InfoButton({ value, icon }: Props) {
  return (
    <button className="tag info">
      <strong>{value}</strong>
      {"  "}
      <FontAwesomeIcon icon={icon} size="xl" />
    </button>
  );
}

export default InfoButton;
