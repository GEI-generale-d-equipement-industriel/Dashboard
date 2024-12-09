import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setPageSize } from '../store/candidatesSlice';
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
    <div className="flex flex-col items-center justify-between sm:flex-row mb-6">
      <div className="text-sm text-gray-700 flex items-center mb-4 sm:mb-0">
        Showing <span className="font-medium ml-1">{(currentPage - 1) * pageSize + 1}</span> to{' '}
        <span className="font-medium ml-1">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
        <span className="font-medium ml-1">{totalItems}</span> results
      </div>
      <AntdPagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
        className="ant-pagination flex items-center justify-center"
        showSizeChanger
        size="small"
      />
    </div>
  );
};

export default Pagination;
