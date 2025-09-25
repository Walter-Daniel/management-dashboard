const Table = ({
  columns,
}: {
  columns: Array<{ header: string; accesor: string; className?: string }>;
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
    </table>
  );
};

export default Table;
