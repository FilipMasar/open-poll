import React, { ReactNode } from 'react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((data: T) => ReactNode);
  className?: string;
  hideOnMobile?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

function Table<T>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-left text-xs sm:text-sm font-medium text-black uppercase tracking-wider ${column.hideOnMobile ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-sm ${column.hideOnMobile ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                    >
                      {typeof column.accessor === 'function' 
                        ? column.accessor(item)
                        : item[column.accessor] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length}
                  className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-sm text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table; 