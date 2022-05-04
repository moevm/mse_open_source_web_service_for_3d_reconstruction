import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import { withStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

/*
--------------
|  test data |
--------------

[
                { id: 1, datasets: 'user1_123131323222', status: 10,message: "sd" },
                { id: 2, datasets: 'user1_123131323222', status: 10,message: "fff" },
                { id: 3, datasets: 'user1_123131323222', status: 7,message: "CasdfACAS" },
                { id: 4, datasets: 'user1_123131323222', status: 5,message: "CACAS" },
                { id: 5, datasets: 'user1_123131323222', status: 3,message: "CACAasasdfS" },
                { id: 6, datasets: 'user1_123131323222', status: 3,message: "CACAS" },
                { id: 7, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
                { id: 8, datasets: 'user1_123131323222', status: 0,message: "CACAasasdfS" },
                { id: 9, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
                { id: 10, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
            ]
*/

class MeshroomProgress extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            columns : [
                {
                    field: 'id',
                    headerName: 'ID',
                    width: 100
                },
                {
                    field: 'datasets',
                    headerName: 'Project',
                    width: 150,
                    editable: true,
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    type: 'number',
                    width: 150,
                    editable: true,
                },
                {
                    field: 'message',
                    headerName: 'Progress',
                    type: 'number',
                    width: 150,
                },
            ],
            page: 0,
            rowsPerPage: 7
        }
    }

    isDownloadable(row){
        if(row.status === 100){
            return (
                <TableCell>
                    <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                        <GetAppIcon/>
                    </a>
                </TableCell>
            )
        }
        else{
            return (
                <TableCell>
                    {row.message}
                </TableCell>
            )
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            page: 0,
            rowsPerPage: +event.target.value
        })
    };

    render(){
        return (
            <>
                <Typography variant="h4"> A list of your projects. </Typography>
                <Paper elevation={6} style={{ maxHeight: '65vh', width: "100%", overflow: 'auto'}}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {this.state.columns.map((column) => (
                                            <StyledTableCell key={column.field} align='left' >
                                                {column.headerName}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.props.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row =>(
                                        <StyledTableRow key={row.id}>
                                            <TableCell>{row.id} </TableCell>
                                            <TableCell>{row.datasets} </TableCell>
                                            <TableCell>{`${row.status}%`} </TableCell>
                                            {this.isDownloadable(row)}
                                        </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[7, 10, 15]}
                            component="div"
                            count={this.props.rows.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onPageChange={this.handleChangePage}
                            onRowsPerPageChange={this.handleChangeRowsPerPage}
                        />
                </Paper>
            </>
        );
    }
}

export default MeshroomProgress;

