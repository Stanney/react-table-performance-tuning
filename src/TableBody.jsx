import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableRow from './TableRow';

const TOTAL_SOURCE_NUM = 5000;
const SCROLL_TABLE_HEIGHT = 400;
const ITEMNUM_IN_SCROLL_TABLE = 11;
const ITEM_HEIGHT = 37;

class TableBody extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        emptyText: PropTypes.func,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        records: PropTypes.array,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number
    };

    static defaultProps = {
        emptyText: () => {
            return 'No Data';
        },
        onMouseOver: () => {},
        onTouchStart: () => {},
        onScroll: () => {},
        records: [],
        rowKey: 'key'
    };

    componentDidMount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        document.getElementById('list').addEventListener('scroll', onScroll);
        this.body.addEventListener('mouseover', onMouseOver);
        this.body.addEventListener('touchstart', onTouchStart);
    }
    componentWillUnmount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        document.getElementById('list').removeEventListener('scroll', onScroll);
        this.body.removeEventListener('mouseover', onMouseOver);
        this.body.removeEventListener('touchstart', onTouchStart);
    }

    componentDidUpdate(prevProps, prevState) {
        const { scrollTop } = this.props;
        if (this.body.scrollTop !== scrollTop) {
            this.body.scrollTop = scrollTop;
        }
    }

    getRowKey (record, index) {
        const rowKey = this.props.rowKey;
        let key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);
        return key === undefined ? `table_row_${index}` : key;
    }

    render() {
        const {
            columns,
            currentHoverKey,
            expandedRowKeys,
            expandedRowRender,
            emptyText,
            onRowHover,
            onRowClick,
            records,
            rowClassName,
            scrollTop
        } = this.props;
        const noData = (!records || records.length === 0);
        const fullHeight = scrollTop + SCROLL_TABLE_HEIGHT;
        const number = Math.ceil(fullHeight / ITEM_HEIGHT);
        const startNum = number - ITEMNUM_IN_SCROLL_TABLE;
        const topHeight = (startNum - 1) > 0 ? (startNum - 1) * ITEM_HEIGHT : 0;
        const endHeight = (TOTAL_SOURCE_NUM - number) * ITEM_HEIGHT;
        const filterRecords = [
            ...records.slice(number - ITEMNUM_IN_SCROLL_TABLE, number)
        ];
        return (
            <div
                className={styles.tbody}
                ref={node => {
                    this.body = node;
                }}
            >
                <div style={{ height: topHeight }} />
                {
                    filterRecords.map((row, index) => {
                        const key = this.getRowKey(row, index);
                        return (
                            <TableRow
                                columns={columns}
                                currentHoverKey={currentHoverKey}
                                expandedRowKeys={expandedRowKeys}
                                expandedRowRender={expandedRowRender}
                                hoverKey={key}
                                index={index}
                                key={key}
                                onHover={onRowHover}
                                onRowClick={onRowClick}
                                record={row}
                                rowClassName={rowClassName}
                            />
                        );
                    })
                }
                {
                    noData &&
                    <div className={styles.tablePlaceholder}>
                        { emptyText() }
                    </div>
                }
                <div style={{ height: endHeight }} />
            </div>
        );
    }
}

export default TableBody;
