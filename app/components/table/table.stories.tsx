import { Header, Row, Table } from "./table";

export const Index = () => {
  return (
    <Table>
      <Header columns={12}>
        <Header.Column span={1}>#</Header.Column>
        <Header.Column span={2}>Name</Header.Column>
        <Header.Column span={2}>Symbol</Header.Column>
        <Header.Column span={2}>Price</Header.Column>
        <Header.Column span={2}>Market Cap</Header.Column>
        <Header.Column span={2}>24h Volume</Header.Column>
        <Header.Column span={1}>24h Change</Header.Column>
      </Header>
      <Row columns={12} to="#">
        <Row.Column span={1}>1</Row.Column>
        <Row.Column span={2}>Bitcoin</Row.Column>
        <Row.Column span={2}>BTC</Row.Column>
        <Row.Column span={2}>$50,000</Row.Column>
        <Row.Column span={2}>$1,000,000,000</Row.Column>
        <Row.Column span={2}>$100,000,000</Row.Column>
        <Row.Column span={1}>+5%</Row.Column>
      </Row>
      <Row columns={12} to="#">
        <Row.Column span={1}>2</Row.Column>
        <Row.Column span={2}>Ethereum</Row.Column>
        <Row.Column span={2}>ETH</Row.Column>
        <Row.Column span={2}>$3,000</Row.Column>
        <Row.Column span={2}>$300,000,000</Row.Column>
        <Row.Column span={2}>$10,000,000</Row.Column>
        <Row.Column span={1}>+2%</Row.Column>
      </Row>
    </Table>
  );
};
