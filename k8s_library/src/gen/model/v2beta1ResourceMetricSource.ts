/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1.13.10
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
* ResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the \"pods\" source.  Only one \"target\" type should be set.
*/
export class V2beta1ResourceMetricSource {
    /**
    * name is the name of the resource in question.
    */
    'name': string;
    /**
    * targetAverageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
    */
    'targetAverageUtilization'?: number;
    /**
    * targetAverageValue is the target value of the average of the resource metric across all relevant pods, as a raw value (instead of as a percentage of the request), similar to the \"pods\" metric source type.
    */
    'targetAverageValue'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "targetAverageUtilization",
            "baseName": "targetAverageUtilization",
            "type": "number"
        },
        {
            "name": "targetAverageValue",
            "baseName": "targetAverageValue",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return V2beta1ResourceMetricSource.attributeTypeMap;
    }
}

