import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {Box, Paper, Table, TableContainer, Typography} from "@mui/material";
import store from "../store/store";
import * as PropTypes from "prop-types";
import { DataGrid } from '@material-ui/data-grid';

DataGrid.propTypes = {
    checkboxSelection: PropTypes.bool,
    pageSize: PropTypes.number,
    disableSelectionOnClick: PropTypes.bool
};

class MeshroomProgress extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            rows:[
                { id: 1, datasets: 'user1_123131323222', status: 7,message: "CAassadadadadadad a dad a dfasdfCAS" },
                { id: 2, datasets: 'user1_123131323222', status: 7,message: "CAasdfasdfCAS" },
                { id: 3, datasets: 'user1_123131323222', status: 4,message: "CasdfACAS" },
                { id: 4, datasets: 'user1_123131323222', status: 2,message: "CACAS" },
                { id: 5, datasets: 'user1_123131323222', status: 0,message: "CACAasasdfS" },
                { id: 6, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
                { id: 7, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
                { id: 8, datasets: 'user1_123131323222', status: 0,message: "CACAasasdfS" },
                { id: 9, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
                { id: 10, datasets: 'user1_123131323222', status: 0,message: "CACAS" },
            ],
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
            ]

        }
    }

    componentWillMount() {

    }

    render(){
        return (
            <>
                <Typography variant="h4"> A list of user "{store.getState().username}" projects. </Typography>
                <TableContainer component={Paper}>
                    <Table style={{ height: 490, width: "100%"}}>
                        <DataGrid
                            rows={this.state.rows}
                            columns={this.state.columns}
                            pageSize={6}
                        />
                    </Table>
                </TableContainer>
            </>
        );
    }
}

export default MeshroomProgress;

