export const CREDENTIALS = {
  valid: {
    facilityCode: process.env.FACILITY_CODE,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
  invalid: {
    facilityCode: "nothing",
    email: "rusha@gmail.com",
    password: "ifhdjhfjfhgjdf",
  },
  empty: {
    facilityCode: "",
    email: "",
    password: "",
  },
  security: {
    sqlInjection: {
      email: "admin' OR '1'='1"
    },
    xss: {
      facilityCode: "<script>alert('xss')</script>",
      email: "<img src=x onerror=alert(1)>"
    },
  },
};

export const ERROR_MESSAGES = {
  invalidFacilityCode: /invalid facility code/i,
  userNotRegistered: /user not registered/i,
  invalidCredentials: /invalid credentials/i,
  facilityRequired: /facility.*required/i,
  emailRequired: /email.*required/i,
  passwordRequired: /password.*required/i,
  invalidEmail: /value is not a valid email address/i
};
