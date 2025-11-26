const Table = ({
  columns,
  renderRows,
  data,
}: {
  columns: Array<{ header: string; accesor: string; className?: string }>;
  renderRows: (item: any) => React.ReactNode;
  data: Array<any>;
}) => {
  return (
    <table className='w-full mt-4'>
      <thead>
        <tr className='text-left text-sm text-gray-500 border-b border-gray-200'>
          {columns.map((column) => (
            <th key={column.accesor} className={column.className}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRows(item))}</tbody>
    </table>
  );
};

export default Table;
