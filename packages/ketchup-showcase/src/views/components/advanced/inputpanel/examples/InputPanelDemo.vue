<template>
  <div>
    <demo
      :demoComp="demoComp"
      :demoEvents="demoEvents"
      :demoMethods="demoMethods"
      :demoProps="demoProps"
    ></demo>
  </div>
</template>

<script>
import Demo from '@/views/templates/Demo';
import { baseData } from '@/mock/chart';

export default {
  components: {
    Demo,
  },
  name: 'InputPanelDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-form-ready',
          type: 'CustomEvent',
        },
      ],
      demoMethods: [],
      demoProps: [
        {
          prop: 'customStyle',
          description:
            'Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization',
          type: 'string',
          default: '""',
          try: 'css',
        },
        {
          prop: 'data',
          description: 'Actual data of the form.',
          type: 'KupInputPanelData',
          default: 'null',
          try: 'json',
        },
        {
          prop: 'hiddenSubmitButton',
          description:
            'Creates a hidden submit button in order to submit the form with enter.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'submitCb',
          description: 'Sets the callback function on submit form.',
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'handleEventsCallbacks',
          description: 'Sets the callbacks functions on ketchup events.',
          type: 'InputPanelEventsCallback',
          isArray: true,
          default: '[]',
          try: 'json',
        },
      ],
    };
  },
};

function createComp() {
  const comp = document.createElement('kup-input-panel');
  comp.data = {
    columns: [
      {
        name: 'NAM',
        title: 'Name',
        visible: true,
      },
      {
        name: 'SUR',
        title: 'Surname',
        visible: true,
      },
      {
        name: 'NAT',
        title: 'Nation',
        visible: true,
      },
      {
        name: 'CIT',
        title: 'City',
        visible: true,
      },
    ],
    rows: [
      {
        cells: {
          NAM: {
            value: '',
            obj: {
              t: '',
              p: '',
              k: '',
            },
            editable: true,
            mandatory: true,
            shape: 'ITX',
          },
          SUR: {
            value: '',
            obj: {
              t: '',
              p: '',
              k: '',
            },
            editable: true,
            mandatory: true,
            shape: 'ITX',
          },
          NAT: {
            value: '',
            options: [
              {
                id: 'ITA',
                label: 'Italy',
              },
              {
                id: 'SPA',
                label: 'Spain',
              },
              {
                id: 'GER',
                label: 'Germany',
              },
              {
                id: 'FRA',
                label: 'France',
              },
              {
                id: 'POR',
                label: 'Portugal',
              },
              {
                id: 'ENG',
                label: 'England',
              },
            ],
            obj: {
              t: '',
              p: '',
              k: '',
            },
            editable: true,
            mandatory: true,
            shape: 'CMB',
          },
          CIT: {
            value: '',
            obj: {
              t: '',
              p: '',
              k: '',
            },
            editable: true,
            mandatory: true,
            options: [
              {
                id: 'ROM',
                label: 'Rome',
              },
              {
                id: 'FLO',
                label: 'Florence',
              },
              {
                id: 'VEN',
                label: 'Venice',
              },
              {
                id: 'MAD',
                label: 'Madrid',
              },
              {
                id: 'BAR',
                label: 'Barcelona',
              },
              {
                id: 'SEV',
                label: 'Seville',
              },
              {
                id: 'BER',
                label: 'Berlin',
              },
              {
                id: 'MUN',
                label: 'Munich',
              },
              {
                id: 'HAM',
                label: 'Hamburg',
              },
              {
                id: 'PAR',
                label: 'Paris',
              },
              {
                id: 'MAR',
                label: 'Marseille',
              },
              {
                id: 'LYO',
                label: 'Lyon',
              },
              {
                id: 'LIS',
                label: 'Lisbon',
              },
              {
                id: 'POR',
                label: 'Porto',
              },
              {
                id: 'FAR',
                label: 'Faro',
              },
              {
                id: 'LON',
                label: 'London',
              },
              {
                id: 'MAN',
                label: 'Manchester',
              },
              {
                id: 'LIV',
                label: 'Liverpool',
              },
            ],
            shape: 'ACP',
          },
        },
        layout: {},
      },
    ],
  };
  comp.id = 'demo-component';

  return comp;
}
</script>
