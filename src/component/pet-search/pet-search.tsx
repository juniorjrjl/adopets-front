import React, {Component} from 'react';
import { Tag, Table, Row, Col, Button, Tooltip, Layout } from 'antd';
import { PetTableModel } from './type/pet-table-model';
import moment from 'moment';
import { ColumnProps, SortOrder } from 'antd/lib/table';
import { PaymentType } from './type/enum/payment-type';
import { Sex } from './type/enum/sex';
import { Size } from './type/enum/size';
import { Age } from './type/enum/age';
import 'antd/dist/antd.min.css'
import './pet-search.css'
import { SessionKey } from '../../constants/session-key';
const  { Header, Content} = Layout;

export interface IProps { }

export interface IState {
    currentUser: string
}

export class PetSearch extends Component<IProps, IState>{

    componentDidMount(){
      this.state = {
        currentUser: ""
      }
      let user = sessionStorage.getItem(SessionKey.CURRENT_USER)
      if (user) {
        this.setState({currentUser:  user})
      }
    }

    private sortOptions: SortOrder[] = ["descend", "ascend"]

    private columns: ColumnProps<PetTableModel>[] =[
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Specie',
            dataIndex: 'specie',
            key: 'specie',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Breed',
            dataIndex: 'breed',
            key: 'breed',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Created date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (data:Date) => moment(data).format("DD/MM/YYYY hh:mm:ss"),
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Status',
            dataIndex: 'status_key',
            key: 'status_key',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Payment Model',
            dataIndex: 'payment_model',
            key: 'payment_model',
            render: (data: PaymentType) => data === PaymentType.ADOPTER_PAYS ? "Pago pelo adotante": "grátis",
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },

          {
            title: 'Sex',
            dataIndex: 'sex',
            key: 'sex',
            render: (data: Sex) => Sex[data],
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (data: Size) => Size[data],
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'age',
            dataIndex: 'age',
            key: 'age',
            render: (data :Age) => Age[data],
            sorter: true,
            sortDirections: ["descend", "ascend"]
          }
    ]

    private data = [];

    render(){
        return <div>
          <Header id="login-header">
            <Row>
              <Col span={4} offset={20}>
                <Tag id="username">Welcome Fulano de Tal</Tag>
                <Tooltip placement="bottom" title="logout">
                  <Button shape="circle" icon="logout" />
                </Tooltip>
              </Col>
            </Row>
          </Header>
          <Content id="content">
            <Row>
              <Col span={8} offset={8}>
                <h1>Your new friend is waiting for you</h1>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={20} offset={1}>
                <Table locale={{emptyText: "No friends available"}} 
                      pagination={ {pageSizeOptions: ['10', '20'], showSizeChanger: true}} 
                      columns={this.columns} dataSource={this.data} 
                      rowKey="id"/>
              </Col>
            </Row>
          </Content>
        </div>
    }

}