import { useState } from 'react';
import {
  Typography,
  DatePicker,
  Row,
  Col,
  InputNumber,
  Form,
  Card,
  Divider,
  Statistic,
} from 'antd';
import styled from 'styled-components';

const getAmountOfWeekDaysInMonth = (date, weekday) => {
  date.date(1);
  var dif = ((7 + (weekday - date.weekday())) % 7) + 1;
  return Math.floor((date.daysInMonth() - dif) / 7) + 1;
};

const initialValues = {
  salary: 25000,
};

const App = () => {
  const [form] = Form.useForm();

  const [businessDays, setBusinessDays] = useState(0);

  const onChangeMonth = (momentObj) => {
    if (!momentObj) return;

    const numOfSaturdays = getAmountOfWeekDaysInMonth(momentObj, 6);
    const numOfSundays = getAmountOfWeekDaysInMonth(momentObj, 0);
    const numOfBusinessDays =
      momentObj.daysInMonth() - numOfSaturdays - numOfSundays;
    setBusinessDays(numOfBusinessDays);
  };

  return (
    <Wrapper>
      <Row>
        <Col
          xs={{ offset: 2, span: 20 }}
          md={{ offset: 6, span: 12 }}
          lg={{ offset: 8, span: 8 }}
        >
          <div className="title-container">
            <Typography.Title level={4}>OT CALCULATOR BY GUN</Typography.Title>
          </div>
          <Card>
            <Form form={form} layout="vertical" initialValues={initialValues}>
              {/* start region of input */}
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="Month" name="month">
                    <StyledDatePicker
                      picker="month"
                      format="MM/YYYY"
                      onChange={onChangeMonth}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Salary (THB)" name="salary">
                    <StyledInputNumber />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label="7AM (Days)" name="7am">
                    <StyledInputNumber />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="8AM (Days)" name="8am">
                    <StyledInputNumber />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="9AM (Days)" name="9am">
                    <StyledInputNumber />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="Night Shift (Days)" name="nightShift">
                    <StyledInputNumber />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Extra (Hours)" name="extra">
                    <StyledInputNumber />
                  </Form.Item>
                </Col>
              </Row>
              {/* end of region input */}
              <StyledDivider />
              {/* start region output */}
              <Row gutter={0}>
                <Col span={8}>
                  <StyledStatistic title="Duty (Hours)" />
                </Col>
                <Col span={8}>
                  <StyledStatistic title="OT (Hours)" />
                </Col>
                <Col span={8}>
                  <StyledStatistic title="Total (Hours)" />
                </Col>
              </Row>
              <Row gutter={8} className="summary-row">
                <Col span={12}>
                  <StyledStatistic title="OT (THB)" />
                </Col>
                <Col span={12}>
                  <StyledStatistic title="Total Income (THB)" />
                </Col>
              </Row>
              {/* end of region output */}
            </Form>
          </Card>
        </Col>
      </Row>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 70px 0;

  .title-container {
    text-align: center;
    margin-bottom: 40px;
  }

  .summary-row {
    margin-top: 20px;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
`;

const StyledDivider = styled(Divider)`
  margin-top: 0;
  margin-bottom: 10px;
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-content {
    font-size: 16px;
  }
`;

export default App;
