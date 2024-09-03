import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage,setPageSize } from '../store/candidatesSlice';
import { Pagination as AntdPagination } from 'antd';

const Pagination = ({ totalItems }) => {
    const dispatch = useDispatch();
    const currentPage = useSelector((state) => state.candidates.currentPage);
    const pageSize = useSelector((state) => state.candidates.pageSize);

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };
    const handlePageSizeChange = (current, size) => {
        dispatch(setPageSize(size));
    };
    return (
        <div className="mt-6 flex flex-col items-center sm:flex-row">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0 flex items-center">
                Showing <span className="font-medium ml-1">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium ml-1">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
                <span className="font-medium ml-1">{totalItems}</span> results
            </div>
            <AntdPagination
                
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                className="ant-pagination flex items-center justify-center"
                onShowSizeChange={handlePageSizeChange} // Handle page size change
                showSizeChanger
                size="small" // Optional: Adjust pagination size if needed
            />
        </div>
    );
};

export default Pagination;
