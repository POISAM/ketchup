export const mockedTaskData = {
  columns: [
    {
      name: 'ID',
      title: 'Task identifier',
    },
    {
      name: 'NAME',
      title: 'Task name',
    },
    {
      name: 'START',
      title: 'Task start date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'END',
      title: 'Task end date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'SEC_START',
      title: 'Forecast task start date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'SEC_END',
      title: 'Forecast task end date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
  ],
  rows: [
    {
      cells: {
        ID: {
          value: 'G456',
        },
        NAME: {
          value: 'G456',
        },
        START: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-06-04',
        },
        END: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-12-04',
        },
        SEC_START: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-06-04',
        },
        SEC_END: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-12-04',
        },
      },
    },
  ],
};

export const mockedPhaseData = {
  columns: [
    {
      name: 'ID',
      title: 'Phase identifier',
    },
    {
      name: 'NAME',
      title: 'Phase name',
    },
    {
      name: 'START',
      title: 'Phase start date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'END',
      title: 'Phase end date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'SEC_START',
      title: 'Forecast phase start date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'SEC_END',
      title: 'Forecast phase end date',
      obj: {
        t: 'D8',
        p: '*YYMD',
        k: '',
      },
    },
    {
      name: 'PHASE_COL',
      title: 'Color',
      obj: {
        t: '',
        p: '',
        k: '',
      },
    },
  ],
  rows: [
    {
      cells: {
        ID: {
          value: 'F001',
        },
        NAME: {
          value: 'F001',
        },
        START: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-07-04',
        },
        END: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-08-04',
        },
        SEC_START: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-07-04',
        },
        SEC_END: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '',
          },
          value: '2022-08-04',
        },
        PHASE_COL: {
          value: '#FF0000',
        },
      },
    },
  ],
};

export const mockedProps = {
  titleMess: 'Title',
  taskIdCol: 'ID',
  taskNameCol: 'NAME',
  taskDates: ['START', 'END'],
  taskPrevDates: ['SEC_START', 'SEC_END'],
  taskColumns: ['ID', 'NAME'],
  phaseIdCol: 'ID',
  phaseNameCol: 'NAME',
  phaseDates: ['START', 'END'],
  phasePrevDates: ['SEC_START', 'SEC_END'],
  phaseColorCol: 'PHASE_COL',
  phaseColumns: ['SEC_START', 'SEC_END'],
  showSecondaryDates: false,
  detailHeight: 200,
  taskHeight: 200,
};

export function getMockupTaskDatas() {
  return {
    columns: [
      {
        name: 'ID',
        title: 'Task identifier',
      },
      {
        name: 'NAME',
        title: 'Task name',
      },
      {
        name: 'START',
        title: 'Task start date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'END',
        title: 'Task end date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'SEC_START',
        title: 'Forecast task start date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'SEC_END',
        title: 'Forecast task end date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
    ],
    rows: [
      {
        id: '1',
        cells: {
          ID: {
            value: '1',
          },
          NAME: {
            value: 'G503',
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-06-04',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-04',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-06-04',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-04',
          },
        },
      },
      {
        id: '2',
        cells: {
          ID: {
            value: '2',
          },
          NAME: {
            value: 'G504',
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-07-04',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-04',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-07-04',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-04',
          },
        },
      },
      {
        id: '3',
        cells: {
          ID: {
            value: '3',
          },
          NAME: {
            value: 'G505',
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-11-03',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-28',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-11-03',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-28',
          },
        },
      },
      {
        id: '4',
        cells: {
          ID: {
            value: '4',
          },
          NAME: {
            value: 'G506',
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-05-19',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-09-18',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-05-19',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-09-18',
          },
        },
      },
      {
        id: '5',
        cells: {
          ID: {
            value: '5',
          },
          NAME: {
            value: 'G507',
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-10-19',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-18',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-10-19',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-18',
          },
        },
      },
      {
        id: '6',
        cells: {
          ID: {
            value: '6',
          },
          NAME: {
            value: 'G508',
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-11-15',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-25',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-11-15',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-12-25',
          },
        },
      },
    ],
  };
}

export function getMockupPhaseDatas(taskRowId) {
  return {
    columns: [
      {
        name: 'ID',
        title: 'Phase identifier',
      },
      {
        name: 'NAME',
        title: 'Phase name',
      },
      {
        name: 'START',
        title: 'Phase start date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'END',
        title: 'Phase end date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'SEC_START',
        title: 'Forecast phase start date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'SEC_END',
        title: 'Forecast phase end date',
        obj: {
          t: 'D8',
          p: '*YYMD',
          k: '',
        },
      },
      {
        name: 'PHASE_COL',
        title: 'Color',
        obj: {
          t: '',
          p: '',
          k: '',
        },
      },
    ],
    rows: [
      {
        id: taskRowId + 1,
        cells: {
          ID: {
            value: taskRowId + 1,
          },
          NAME: {
            value: 'F00' + (taskRowId + 1),
          },
          START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-07-04',
          },
          END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-08-04',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-07-04',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-08-04',
          },
          PHASE_COL: {
            value: '#FF0000',
          },
        },
      },
      {
        id: taskRowId + 2,
        cells: {
          ID: {
            value: taskRowId + 2,
          },
          NAME: {
            value: 'F00' + (taskRowId + 2),
          },
          START: {
            value: '2022-07-05',
          },
          END: {
            value: '2022-08-05',
          },
          SEC_START: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-07-05',
          },
          SEC_END: {
            obj: {
              t: 'D8',
              p: '*YYMD',
              k: '',
            },
            value: '2022-08-05',
          },
          PHASE_COL: {
            value: '#FF0000',
          },
        },
      },
    ],
  };
}
