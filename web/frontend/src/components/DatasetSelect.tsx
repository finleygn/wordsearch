import { Dataset } from "../hooks/useDatasets";

interface IDatasetSelectProps {
  target: string;
  options: Dataset[];
  loading: boolean;
}

function DatasetSelect(props: IDatasetSelectProps) {
  const valid = props.loading || props.options.some(s => s.name === props.target);

  return (
    <select value={props.target}>
    </select>
  )
}

export default DatasetSelect;