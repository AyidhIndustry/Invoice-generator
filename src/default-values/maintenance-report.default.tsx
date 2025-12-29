

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
    maintenanceStatus: 'PENDING',
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
