import { Table, ScrollArea } from '@mantine/core';
import cx from 'clsx';
import classes from './Tabular.module.css';

const Tabular = ({ scrolled, setScrolled, columns, formatCell, data }) => {

    return (
        <div>
            <ScrollArea h={400} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <Table style={{ width: '100%', minWidth: '500px' }} withColumnBorders withRowBorders withTableBorder>
                    <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                        <Table.Tr>
                            {columns.map((col) => (
                                <Table.Th key={col.accessor}>{col.label}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {data.map((row) => (
                            <Table.Tr key={row._id}>
                                {columns.map((col) => (
                                    <Table.Td key={col.accessor}>
                                        {formatCell ? formatCell(col.accessor, row[col.accessor], row) : row[col.accessor]}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    );
};

export default Tabular;
