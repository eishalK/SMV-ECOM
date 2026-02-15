import React from 'react';

const DataTable = ({ columns, data, keys, renderActions }) => {
    return (
        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50">
                        {columns.map((col, idx) => (
                            <th key={idx} className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                {col}
                            </th>
                        ))}
                        {renderActions && (
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="text-[11px] font-bold">
                    {data && data.length > 0 ? (
                        data.map((item, rowIdx) => (
                            <tr key={item._id || rowIdx} className="border-t border-gray-50 hover:bg-gray-50/10 transition-colors group">
                                {keys.map((key, colIdx) => (
                                    <td key={colIdx} className="p-6">
                                        {key === 'email' ? (
                                            <span className="font-normal text-gray-400 lowercase">{item[key]}</span>
                                        ) : key === '_id' ? (
                                            <span className="text-gray-400 font-mono text-[9px]">
                                                #{String(item[key])?.substring(0, 8)}
                                            </span>
                                        ) : (
                                            /* Renders strings, numbers, or JSX components (badges) */
                                            item[key] ?? "—" 
                                        )}
                                    </td>
                                ))}
                                
                                {renderActions && (
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {renderActions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="100%" className="p-20 text-center text-gray-300 uppercase tracking-widest text-[10px]">
                                No records found in database
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;