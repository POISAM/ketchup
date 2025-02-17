export const baseData = {
  columns: [
    {
      name: 'Col1',
      title: 'Department',
      size: '10',
    },
    {
      name: 'Col2',
      title: 'Current Budget',
      size: '10',
    },
    {
      name: 'Col3',
      title: 'Projected Budget',
      size: '10',
    },
    {
      name: 'Col4',
      title: 'Allocated Budget',
      size: '10',
    },
  ],
  rows: [
    {
      cells: {
        Col1: {
          obj: {
            t: 'CN',
            p: 'COL',
            k: 'Marketing',
          },
          value: 'Marketing',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '10',
          },
          value: '10',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '100.50',
          },
          value: '100.50',
        },
        Col4: {
          obj: {
            t: 'NR',
            p: '',
            k: '55',
          },
          value: '55',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'CN',
            p: 'COL',
            k: 'Sales',
          },
          value: 'Sales',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '6',
          },
          value: '6',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '67.8',
          },
          value: '67.8',
        },
        Col4: {
          obj: {
            t: 'NR',
            p: '',
            k: '33',
          },
          value: '33',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'CN',
            p: 'COL',
            k: 'Administration',
          },
          value: 'Administration',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '5',
          },
          value: '5',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '120.06',
          },
          value: '120.06',
        },
        Col4: {
          obj: {
            t: 'NR',
            p: '',
            k: '77',
          },
          value: '77',
        },
      },
    },
  ],
};

export const singleData = {
  columns: [
    {
      name: 'Col1',
      title: 'Person',
      size: '10',
    },

    {
      name: 'Col4',
      title: 'Value3',
      size: '10',
    },
  ],
  rows: [
    {
      cells: {
        Col1: {
          obj: {
            t: 'CN',
            p: 'COL',
            k: 'CASFRA',
          },
          value: 'CASFRA',
        },

        Col4: {
          obj: {
            t: 'NR',
            p: '',
            k: '55',
          },
          value: '55',
        },
      },
      id: '0',
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'CN',
            p: 'COL',
            k: 'DELGIO',
          },
          value: 'DELGIO',
        },

        Col4: {
          obj: {
            t: 'NR',
            p: '',
            k: '33',
          },
          value: '33',
        },
      },
      id: '1',
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'CN',
            p: 'COL',
            k: 'PARFRA',
          },
          value: 'PARFRA',
        },

        Col4: {
          obj: {
            t: 'NR',
            p: '',
            k: '77',
          },
          value: '77',
        },
      },
      id: '2',
    },
  ],
};

export const comboData = {
  columns: [
    {
      name: 'Col1',
      title: 'State',
      size: '10',
    },
    {
      name: 'Col2',
      title: 'Value1',
      size: '10',
    },
    {
      name: 'Col3',
      title: 'Value2',
      size: '10',
    },
  ],
  rows: [
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'Italy',
          },
          value: 'Italy',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '45',
          },
          value: '45',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'France',
          },
          value: 'France',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '60',
          },
          value: '60',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '35',
          },
          value: '35',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'Spain',
          },
          value: 'Spain',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '45',
          },
          value: '45',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '70',
          },
          value: '70',
        },
      },
    },
  ],
};

export const calendarData = {
  columns: [
    {
      name: 'Col1',
      title: 'Day',
      size: '10',
    },
    {
      name: 'Col2',
      title: 'value',
      size: '10',
    },
  ],
  rows: [
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20190102',
          },
          value: '2019-01-02',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '1000',
          },
          value: '1000',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20190603',
          },
          value: '2019-06-03',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '2000',
          },
          value: '2000',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20191212',
          },
          value: '2019-12-12',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '1700',
          },
          value: '1700',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20190725',
          },
          value: '2019-07-25',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '800',
          },
          value: '800',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20190903',
          },
          value: '2019-09-03',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '2300',
          },
          value: '2300',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20190518',
          },
          value: '2019-05-18',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '450',
          },
          value: '450',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'D8',
            p: '*YYMD',
            k: '20190415',
          },
          value: '2019-04-15',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '900',
          },
          value: '900',
        },
      },
    },
  ],
};

export const ageWeightData = {
  columns: [
    {
      name: 'Col1',
      title: 'Age',
      size: '10',
    },
    {
      name: 'Col2',
      title: 'Weight',
      size: '10',
    },
  ],
  rows: [
    {
      cells: {
        Col1: {
          obj: {
            t: 'NR',
            p: '',
            k: '4',
          },
          value: '4',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '5.5',
          },
          value: '5.5',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'NR',
            p: '',
            k: '8',
          },
          value: '8',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '12',
          },
          value: '12',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: 'NR',
            p: '',
            k: '11',
          },
          value: '11',
        },
        Col2: {
          obj: {
            t: 'NR',
            p: '',
            k: '14',
          },
          value: '14',
        },
      },
    },
  ],
};

export const mapData = {
  columns: [
    {
      name: 'Col1',
      title: 'State',
      size: '10',
    },
    {
      name: 'Col2',
      title: 'Color',
      size: '10',
    },
    {
      name: 'Col3',
      title: 'Value',
      size: '10',
    },
  ],
  rows: [
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'Germany',
          },
          value: 'Germany',
        },
        Col2: {
          obj: {
            t: 'Color',
            p: '',
            k: 'red',
          },
          value: 'red',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '100',
          },
          value: '100',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'United States',
          },
          value: 'United States',
        },
        Col2: {
          obj: {
            t: 'Color',
            p: '',
            k: 'Green',
          },
          value: 'Green',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '200',
          },
          value: '200',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'Brazil',
          },
          value: 'Brazil',
        },
        Col2: {
          obj: {
            t: 'Color',
            p: '',
            k: 'purple',
          },
          value: 'purple',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '300',
          },
          value: '300',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'Canada',
          },
          value: 'Canada',
        },
        Col2: {
          obj: {
            t: 'Color',
            p: '',
            k: 'yellow',
          },
          value: 'yellow',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '400',
          },
          value: '400',
        },
      },
    },
    {
      cells: {
        Col1: {
          obj: {
            t: '',
            p: '',
            k: 'France',
          },
          value: 'France',
        },
        Col2: {
          obj: {
            t: 'Color',
            p: '',
            k: 'orange',
          },
          value: 'orange',
        },
        Col3: {
          obj: {
            t: 'NR',
            p: '',
            k: '500',
          },
          value: '500',
        },
      },
    },
  ],
};
