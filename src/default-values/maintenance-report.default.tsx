

export const defaultMaintenanceReport =
  {
    id: '',
    date: new Date(),
    customer: {
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
    symptoms: '',
    causeOfIssue: '',
    repair: [
      {
        description: '',
        labourHours: '',
        price: '',
      },
    ],
    totalCost: 0,
    remark: '',
  }
