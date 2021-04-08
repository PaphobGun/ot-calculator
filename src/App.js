import { useState, useEffect } from 'react';
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

const publicHolidays = [1, 1, 0, 4, 2, 1, 2, 1, 0, 1, 0, 2];

const licence = 7000;

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

const getOrZero = (num) => {
  return !num ? 0 : num;
};

const App = () => {
  const [form] = Form.useForm();

  const [businessDays, setBusinessDays] = useState(0);
  const [otHour, setOtHour] = useState(0);
  const [totalHour, setTotalHour] = useState(0);
  const [OTIncome, setOTIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dutyHours, setDutyHours] = useState(0);
  const [salary, setSalary] = useState(initialValues.salary);
  const [publicHoliday, setPublicHoliday] = useState(0);
  const [formValues, setFormValues] = useState({});

  const onChangeSalary = (salaryInput) => {
    setSalary(!salaryInput ? 0 : salaryInput);
  };

  useEffect(() => {
    const nightShiftFee = (formValues.nightShift || 0) * 400;

    setTotalIncome(licence + OTIncome + salary + nightShiftFee);
  }, [OTIncome, salary, formValues.nightShift]);

  useEffect(() => {
    setDutyHours((businessDays - getOrZero(publicHoliday)) * 8);
  }, [businessDays, publicHoliday]);

  useEffect(() => {
    setOTIncome(getOTIncome(salary, otHour));
  }, [dutyHours, salary, otHour]);

  const onChangeMonth = (momentObj) => {
    if (!momentObj) return;

    setPublicHoliday(publicHolidays[momentObj.month()]);

    const numOfSaturdays = getAmountOfWeekDaysInMonth(momentObj, 6);
    const numOfSundays = getAmountOfWeekDaysInMonth(momentObj, 0);
    const numOfBusinessDays =
      momentObj.daysInMonth() - numOfSaturdays - numOfSundays;
    setBusinessDays(numOfBusinessDays);
  };

  const onChangeDay = (num, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: num,
    }));
  };

  useEffect(() => {
    const { n7am, n8am, n10am, ot8am, ot9am, nightShift, extra } = formValues;

    const [w7amHour] = calculateHourAndOT(n7am, 'day');
    const [w8amHour] = calculateHourAndOT(n8am, 'day');
    const [w10amHour] = calculateHourAndOT(n10am, 'day');
    const [w8amOTHour, ot8amHour] = calculateHourAndOT(ot8am, 'dayWithOT');
    const [w9amOTHour, ot9amHour] = calculateHourAndOT(ot9am, 'dayWithOT');
    const [nightHour, nightOT] = calculateHourAndOT(nightShift, 'night');
    const [extraHour, extraOT] = calculateHourAndOT(extra, 'extra');

    const totalHours =
      w7amHour +
      w8amHour +
      w10amHour +
      w8amOTHour +
      ot8amHour +
      w9amOTHour +
      ot9amHour +
      nightHour +
      nightOT +
      extraHour +
      extraOT;

    setTotalHour(totalHours);

    const abOTHour = totalHours - dutyHours < 0 ? 0 : totalHours - dutyHours;

    setOtHour(abOTHour);
  }, [formValues, dutyHours]);

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
                    <StyledInputNumber min={0} onChange={onChangeSalary} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label="7-16" name="n7am">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'n7am')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="8-17" name="n8am">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'n8am')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="10-19" name="n10am">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'n10am')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label="8-20" name="ot8am">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'ot8am')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="9-21" name="ot9am">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'ot9am')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Night Shift" name="nightShift">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'nightShift')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="Extra Hours" name="extra">
                    <StyledInputNumber
                      min={0}
                      onChange={(num) => onChangeDay(num, 'extra')}
                    />
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
                  <StyledStatistic
                    title={
                      <Tooltip
                        title={
                          <Card>
                            <div>
                              ({salary}/240) * 1.5 * {otHour}
                            </div>
                          </Card>
                        }
                      >
                        OT THB <QuestionCircleOutlined />
                      </Tooltip>
                    }
                    value={OTIncome}
                  />
                </Col>
                <Col span={12}>
                  <StyledStatistic
                    // title="Total Income (THB)"
                    title={
                      <Tooltip
                        title={
                          <Card>
                            <div>Salary + Licence + OT + night shift</div>
                            <div>
                              {salary} + {licence} + {OTIncome} +{' '}
                              {(formValues.nightShift || 0) * 400}={' '}
                              {totalIncome} THB
                            </div>
                          </Card>
                        }
                      >
                        Total Income <QuestionCircleOutlined />
                      </Tooltip>
                    }
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
