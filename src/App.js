import { useState, useMemo, useEffect } from 'react';
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
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const certificate = 7000;

const initialValues = {
  salary: 25000,
};

const getOTIncome = (salary, OTHour) => {
  return (salary / 240) * 1.5 * OTHour;
};

const getAmountOfWeekDaysInMonth = (date, weekday) => {
  date.date(1);
  var dif = ((7 + (weekday - date.weekday())) % 7) + 1;
  return Math.floor((date.daysInMonth() - dif) / 7) + 1;
};

const calculateHourAndOT = (num, mode) => {
  let workingHours = 0;
  let OTHours = 0;

  if (!num) return [workingHours, OTHours];

  if (mode === 'day') {
    workingHours = num * 8;
  } else if (mode === 'dayWithOT') {
    workingHours = num * 8;
    OTHours = num * 3;
  } else if (mode === 'night') {
    workingHours = num * 9;
    OTHours = num * 3;
  } else {
    workingHours = 0;
    OTHours = num;
  }

  return [workingHours, OTHours];
};

const App = () => {
  const [form] = Form.useForm();

  const [businessDays, setBusinessDays] = useState(0);
  const [otHour, setOtHour] = useState(0);
  const [totalHour, setTotalHour] = useState(0);
  const [OTIncome, setOTIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    setOTIncome(getOTIncome(form.getFieldValue('salary'), otHour));
  }, [form, otHour]);

  useEffect(() => {
    setTotalIncome(certificate + OTIncome + form.getFieldValue('salary'));
  }, [OTIncome, form]);

  const dutyHours = useMemo(() => {
    // TODO:  ADD PUBLIC HOLIDAY IN THE GIVEN MONTH
    // return (businessDays - numOfPublicHoidays) * 8;

    return businessDays * 8;
  }, [businessDays]);

  const onChangeMonth = (momentObj) => {
    if (!momentObj) return;

    const numOfSaturdays = getAmountOfWeekDaysInMonth(momentObj, 6);
    const numOfSundays = getAmountOfWeekDaysInMonth(momentObj, 0);
    const numOfBusinessDays =
      momentObj.daysInMonth() - numOfSaturdays - numOfSundays;
    setBusinessDays(numOfBusinessDays);
  };

  const onChangeDays = () => {
    const {
      n7am,
      n8am,
      n9am,
      ot7am,
      ot8am,
      ot9am,
      nightShift,
      extra,
    } = form.getFieldsValue(true);

    const [w7amHour] = calculateHourAndOT(n7am, 'day');
    const [w8amHour] = calculateHourAndOT(n8am, 'day');
    const [w9amHour] = calculateHourAndOT(n9am, 'day');
    const [w7amOTHour, ot7amHour] = calculateHourAndOT(ot7am, 'dayWithOT');
    const [w8amOTHour, ot8amHour] = calculateHourAndOT(ot8am, 'dayWithOT');
    const [w9amOTHour, ot9amHour] = calculateHourAndOT(ot9am, 'dayWithOT');
    const [nightHour, nightOT] = calculateHourAndOT(nightShift, 'night');
    const [extraHour, extraOT] = calculateHourAndOT(extra, 'extra');

    setTotalHour(
      w7amHour +
        w8amHour +
        w9amHour +
        w7amOTHour +
        w8amOTHour +
        w9amOTHour +
        nightHour +
        extraHour +
        extraOT
    );

    setOtHour(ot7amHour + ot8amHour + ot9amHour + nightOT + extraOT);
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
          <div className="tooltip-container">
            <Tooltip title="Calculation is specific to the organization and can not be used elsewhere">
              <span className="tooltip-disclaimer">
                <QuestionCircleOutlined /> Disclaimer
              </span>
            </Tooltip>
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
                    <StyledInputNumber min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label="7-16" name="n7am">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="8-17" name="n8am">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="9-18" name="n9am">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label="7-19" name="ot7am">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="8-20" name="ot8am">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="9-21" name="ot9am">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="Night Shift (Days)" name="nightShift">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Extra (Hours)" name="extra">
                    <StyledInputNumber min={0} onChange={onChangeDays} />
                  </Form.Item>
                </Col>
              </Row>
              {/* end of region input */}
              <StyledDivider />
              {/* start region output */}
              <Row gutter={0}>
                <Col span={8}>
                  <StyledStatistic title="Duty (Hours)" value={dutyHours} />
                </Col>
                <Col span={8}>
                  <StyledStatistic title="OT (Hours)" value={otHour} />
                </Col>
                <Col span={8}>
                  <StyledStatistic title="Total (Hours)" value={totalHour} />
                </Col>
              </Row>
              <Row gutter={8} className="summary-row">
                <Col span={12}>
                  <StyledStatistic title="OT (THB)" value={OTIncome} />
                </Col>
                <Col span={12}>
                  <StyledStatistic
                    title="Total Income (THB)"
                    value={totalIncome}
                  />
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
  padding: 50px 0;

  .title-container {
    text-align: center;
    margin-bottom: 10px;
  }

  .tooltip-container {
    text-align: center;
    margin-bottom: 20px;

    .tooltip-disclaimer {
      color: palevioletred;
    }
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
