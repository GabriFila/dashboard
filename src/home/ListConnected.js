import React, { Component } from 'react';
import { Alert, Button, Divider, PageHeader, Space, Tooltip, Typography } from 'antd';
import FilterOutlined from '@ant-design/icons/lib/icons/FilterOutlined';
import ConnectedPeer from './ConnectedPeer';
import { checkAdvertisement, checkPeeringRequest } from './HomeUtils';
import { LIQO_LABEL_ENABLED } from '../constants';
import LoadingIndicator from '../common/LoadingIndicator';

class ListConnected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outgoingPods: [],
      incomingPods: [],
      loadingServer: true,
      loadingClient: true
    }

    /**
     * Every 30 seconds the metrics are retrieved and the view updated
     */
    this.interval = setInterval( () => {
      this.getClientPODs();
      this.getServerPODs();
    }, 30000);

  }

  /**
   * Searches for pods in namespaces labeled with the LIQO_LABEL_ENABLED
   * The pods in these namespaces are the only one that can be
   * offloaded to the foreign cluster
   */
  getClientPODs(){
    this.props.api.getNamespaces(LIQO_LABEL_ENABLED)
      .then(async (res) => {
        this.state.outgoingPods = [];
        await Promise.all(res.body.items.map(async (ns) => {
          await this.props.api.getPODs(ns.metadata.name)
            .then(async res => {
              await Promise.all(res.body.items.map(po => {
                this.state.outgoingPods.push(po);
              }))
            })
            .catch(error => {
              console.log(error);
            })
        }))
        this.setState({outgoingPods: this.state.outgoingPods, loadingClient: false})
      })
  }

  /**
   * For now, there in no way to restrict the field of pods
   * scheduled in the vk (offloaded to the home cluster)
   * so we take all pods
   */
  getServerPODs(){
    this.props.api.getPODs().
    then(res => {
      let pods = res.body.items;
      this.setState({incomingPods: pods, loadingServer: false})
    })
    .catch(error => {
      console.log(error);
      this.setState({loadingServer: false})
    })
  }

  componentDidMount() {
    this.getClientPODs();
    this.getServerPODs();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let connectedPeers = [];

    this.props.foreignClusters.forEach(fc => {

      let client;
      let server;

      /** I am the client and I am using your resources, so check
       * if there is an advertisement
       */
      if(fc.status.outgoing.joined && fc.status.outgoing.advertisement){
        client = checkAdvertisement(this.props.advertisements, fc.status.outgoing.advertisement).adv;
      }

      /** I am the server and you are using my resources, so check
       * if there is a peering request
       */
      if(fc.status.incoming.joined && fc.status.incoming.peeringRequest){
        server = checkPeeringRequest(this.props.peeringRequests, fc.status.incoming.peeringRequest);
      }

      if(client || server){
        connectedPeers.push(
          <div key={fc.spec.clusterID}>
            <ConnectedPeer {...this.props} incomingPods={this.state.incomingPods}
                           outgoingPods={this.state.outgoingPods}
                           foreignCluster={fc} client={client} server={server} />
          </div>
        )
      }
    });

    return (
      <div className="home-header">
        <PageHeader style={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 16, paddingRight: 16 }}
                    title={
                      <Space>
                        <Typography.Text strong style={{ fontSize: 24 }}>Connected Peers</Typography.Text>
                      </Space>
                    }
                    extra={
                      <Space>
                        <Tooltip title={'Add filter'}>
                          {
                            //TODO: add some filter option
                          }
                          <Button type={'text'} icon={<FilterOutlined/>}/>
                        </Tooltip>
                      </Space>
                    }
                    className={'draggable'}
        />
        <Divider style={{ marginTop: 0, marginBottom: 0 }}/>
        { connectedPeers.length === 0 ? (
          <div style={{ padding: '1em' }}>
            <Alert
              message="No peer connected at the moment"
              description="Join one and start sharing!"
              type="info"
              showIcon
              closable
            />
          </div>
        ) : (
          this.state.loadingServer || this.state.loadingClient ? <LoadingIndicator /> :
          <div>{connectedPeers}</div>
        )}
      </div>
    )
  }
}

export default ListConnected;
