declare namespace app {
  interface stat {
    countDTO: object[];
    hasPassword: boolean;
    todayTotalNumber: number;
    todaySendNumber: number;
    totalNumber: number;
    leaveAccountNumber: number;
  }

  interface responseData {
    code: number;
    message: string;
    data: any;
  }

  interface ExcelStat {
    date: string;
    accountsNumber: number;
    sendCount: number;
    leaveCount: number;
    nameCount: object[];
  }

  type ExcelType = "fight" | "task";
}
