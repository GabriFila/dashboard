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
* DEPRECATED 1.9 - This group version of IPBlock is deprecated by networking/v1/IPBlock. IPBlock describes a particular CIDR (Ex. \"192.168.1.1/24\") that is allowed to the pods matched by a NetworkPolicySpec\'s podSelector. The except entry describes CIDRs that should not be included within this rule.
*/
export class V1beta1IPBlock {
    /**
    * CIDR is a string representing the IP Block Valid examples are \"192.168.1.1/24\"
    */
    'cidr': string;
    /**
    * Except is a slice of CIDRs that should not be included within an IP Block Valid examples are \"192.168.1.1/24\" Except values will be rejected if they are outside the CIDR range
    */
    'except'?: Array<string>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "cidr",
            "baseName": "cidr",
            "type": "string"
        },
        {
            "name": "except",
            "baseName": "except",
            "type": "Array<string>"
        }    ];

    static getAttributeTypeMap() {
        return V1beta1IPBlock.attributeTypeMap;
    }
}

