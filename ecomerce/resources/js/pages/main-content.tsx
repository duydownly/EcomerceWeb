import React from 'react';

export function MainContent({ selectedCategory }: { selectedCategory: string | null }) {
    return (
        <div className="hscreen p-4">
            {selectedCategory === null && <div>Hiển thị toàn bộ sản phẩm</div>}
            {selectedCategory === 'ordermanagementuser' && (
                <div>Hiển thị nội dung của OrderManagementUser</div>
            )}
            {selectedCategory && selectedCategory !== 'ordermanagementuser' && (
                <div>Hiển thị danh mục: {selectedCategory}</div>
            )}
        </div>
    );
}
