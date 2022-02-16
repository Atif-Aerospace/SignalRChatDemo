﻿var importObjects_form = [
    { view: "textarea", id: 'ImportObjects_Scripts_TextArea', label: 'Objects (JSON Format)', name: "ImportObjects_Scripts_TextArea", labelAlign: 'left' },
    {
        view: "align", height: 30, align: "middle,right",
        body: {
            cols: [
                { view: "button", label: "Reset", width: 120, },
                { view: "button", label: "Cancel", width: 120, },
                { view: "button", label: "Create", width: 120, click: ImportObjects },
            ]
        }
    }
];

function ShowImportObjectsUI() {
    $$("tabview1").addView({
        header: "Import Objects", width: 140,
        body: {
            view: "scrollview",
            id: "ImportObjectsUI",
            scroll: "auto",

            body: {

                view: "form", scroll: false,
                align: 'center',
                elements: importObjects_form,
                elementsConfig: {
                    labelPosition: "top",
                    labelWidth: 140,
                }
            }
        }
    });

    $$("ImportObjectsUI").show();
}


function ImportObjects() {
    //if (isDataNameValid($$("dataName").getValue()) === true) {
    //    // #region prepare request json data
    //    let dataJson = {};
    //    dataJson.name = $$("dataName").getValue();
    //    dataJson.category = $$("dataCategory").getValue();
    //    dataJson.description = $$("dataDescription").getValue();
    //    dataJson.type = $$("dataType").getValue();
    //    dataJson.value = $$("dataValue").getValue();
    //    dataJson.unit = $$("dataUnit").getValue();
    //    dataJson.minValue = $$("dataMinValue").getValue();
    //    dataJson.maxValue = $$("dataMaxValue").getValue();
    //    // #endregion


    //    CreateDataObject_WebService(dataJson);
    //}

    let ddd = JSON.parse($$("ImportObjects_Scripts_TextArea").getValue());

    let dataObjects = [
        { "name": "SW", "category": "system.discipline.geometry", "description": "Reference wing area", "type": "Double", "value": "383.74", "unit": "[m2]", "minValue": "0", "maxValue": "100" },
        { "name": "AR", "category": "system.discipline.geometry", "description": "Wing aspect ratio", "type": "Double", "value": "9.0", "unit": "[m2]", "minValue": "0", "maxValue": "100" },
        { "name": "Kink", "category": "system.discipline.geometry", "description": "Kint", "type": "Double", "value": "0.37", "unit": "[m2]", "minValue": "0", "maxValue": "100" },
        { "name": "TR", "category": "system.discipline.geometry", "description": "Wing taper ratio", "type": "Double", "value": "0.275", "unit": "[m2]", "minValue": "0", "maxValue": "100" },
        { "name": "Sweep", "category": "system.discipline.geometry", "description": "Wing sweep", "type": "Double", "value": "35.0", "unit": "[m2]", "minValue": "0", "maxValue": "100" },

        { "name": "mesh_delta_left_x_Aero", "category": "system.discipline.aerodynamics", "description": "mesh_delta_left", "type": "DoubleMatrix", "value": "0.264464, 0.228736, 0.195599, 0.165053, 0.137098, 0.111735, 0.088963, 0.068783, 0.051194, 0.036198, 0.023163, 0.013025, 0.005785, 0.001443, -0.000000; 0.264458, 0.228730, 0.195594, 0.165049, 0.137095, 0.111733, 0.088963, 0.068784, 0.051197, 0.036202, 0.023168, 0.013031, 0.005790, 0.001447, -0.000000; 0.264453, 0.228725, 0.195589, 0.165044, 0.137092, 0.111732, 0.088963, 0.068786, 0.051200, 0.036206, 0.023173, 0.013036, 0.005795, 0.001450, -0.000000; 0.264447, 0.228719, 0.195583, 0.165040, 0.137089, 0.111730, 0.088963, 0.068787, 0.051203, 0.036210, 0.023178, 0.013042, 0.005800, 0.001453, -0.000000; 0.264441, 0.228713, 0.195578, 0.165036, 0.137086, 0.111728, 0.088963, 0.068788, 0.051206, 0.036214, 0.023183, 0.013047, 0.005805, 0.001456, -0.000000; 0.264436, 0.228707, 0.195573, 0.165031, 0.137083, 0.111727, 0.088963, 0.068790, 0.051208, 0.036218, 0.023188, 0.013052, 0.005810, 0.001460, -0.000000; 0.264430, 0.228702, 0.195567, 0.165027, 0.137080, 0.111725, 0.088962, 0.068791, 0.051211, 0.036222, 0.023193, 0.013058, 0.005815, 0.001463, -0.000000", "unit": "[m]", "minValue": "", "maxValue": "" },
        { "name": "mesh_delta_left_y_Aero", "category": "system.discipline.aerodynamics", "description": "mesh_delta_left", "type": "DoubleMatrix", "value": "0.002645, 0.002287, 0.001956, 0.001651, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000130, 0.000058, 0.000014, -0.000000; 0.002645, 0.002287, 0.001956, 0.001650, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000130, 0.000058, 0.000014, -0.000000; 0.002645, 0.002287, 0.001956, 0.001650, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000130, 0.000058, 0.000014, -0.000000; 0.002644, 0.002287, 0.001956, 0.001650, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000130, 0.000058, 0.000015, -0.000000; 0.002644, 0.002287, 0.001956, 0.001650, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000130, 0.000058, 0.000015, -0.000000; 0.002644, 0.002287, 0.001956, 0.001650, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000131, 0.000058, 0.000015, -0.000000; 0.002644, 0.002287, 0.001956, 0.001650, 0.001371, 0.001117, 0.000890, 0.000688, 0.000512, 0.000362, 0.000232, 0.000131, 0.000058, 0.000015, -0.000000", "unit": "[m]", "minValue": "", "maxValue": "" },
        { "name": "mesh_delta_left_z_Aero", "category": "system.discipline.aerodynamics", "description": "mesh_delta_left", "type": "DoubleMatrix", "value": "2.644637, 2.287360, 1.955991, 1.650531, 1.370983, 1.117348, 0.889629, 0.687826, 0.511943, 0.361980, 0.231631, 0.130253, 0.057852, 0.014433, -0.000000; 2.644581, 2.287303, 1.955938, 1.650487, 1.370952, 1.117332, 0.889628, 0.687841, 0.511971, 0.362020, 0.231680, 0.130307, 0.057902, 0.014465, -0.000000; 2.644525, 2.287245, 1.955885, 1.650444, 1.370921, 1.117316, 0.889627, 0.687856, 0.512000, 0.362059, 0.231730, 0.130361, 0.057951, 0.014498, -0.000000; 2.644469, 2.287188, 1.955832, 1.650400, 1.370890, 1.117299, 0.889627, 0.687870, 0.512028, 0.362098, 0.231779, 0.130415, 0.058000, 0.014531, -0.000000; 2.644413, 2.287131, 1.955779, 1.650356, 1.370859, 1.117283, 0.889626, 0.687885, 0.512056, 0.362137, 0.231829, 0.130469, 0.058050, 0.014563, -0.000000; 2.644357, 2.287073, 1.955727, 1.650313, 1.370828, 1.117266, 0.889625, 0.687899, 0.512085, 0.362177, 0.231878, 0.130523, 0.058099, 0.014596, -0.000000; 2.644301, 2.287016, 1.955674, 1.650269, 1.370796, 1.117250, 0.889624, 0.687914, 0.512113, 0.362216, 0.231928, 0.130577, 0.058149, 0.014628, -0.000000", "unit": "[m]", "minValue": "", "maxValue": "" },


        { "name": "LoD_Wing", "category": "system.discipline.aerodynamics", "description": "Reference wing area", "type": "Double", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "CL_Wing_total", "category": "system.discipline.aerodynamics", "description": "Reference wing area", "type": "Double", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "CL_DP_fixed", "category": "system.discipline.aerodynamics", "description": "Reference wing area", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "CD_DP_final", "category": "system.discipline.aerodynamics", "description": "Reference wing area", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "CD_i_DP_final", "category": "system.discipline.aerodynamics", "description": "Reference wing area", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },

        { "name": "loads", "category": "system.discipline.aerodynamics", "description": "Reference wing area", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },

        { "name": "mesh_undeformed_left_x", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "mesh_undeformed_left_y", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "mesh_undeformed_left_z", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "mesh_deformed_left_x", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "mesh_deformed_left_y", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "mesh_deformed_left_z", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleMatrix", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },

        { "name": "spar_pts_undeformed_left_x", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "spar_pts_undeformed_left_y", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "spar_pts_undeformed_left_z", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "spar_pts_deformed_left_x", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "spar_pts_deformed_left_y", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
        { "name": "spar_pts_deformed_left_z", "category": "system.discipline.aerodynamics", "description": "mesh_undeformed", "type": "DoubleVector", "value": "0.0", "unit": "", "minValue": "0", "maxValue": "100" },
    ];

    CreateDataObjects_WebService(ddd.dataObjects);
}