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

import { V1beta1IngressBackend } from './v1beta1IngressBackend';
import { V1beta1IngressRule } from './v1beta1IngressRule';
import { V1beta1IngressTLS } from './v1beta1IngressTLS';

/**
* IngressSpec describes the Ingress the user wishes to exist.
*/
export class V1beta1IngressSpec {
    'backend'?: V1beta1IngressBackend;
    /**
    * A list of host rules used to configure the Ingress. If unspecified, or no rule matches, all traffic is sent to the default backend.
    */
    'rules'?: Array<V1beta1IngressRule>;
    /**
    * TLS configuration. Currently the Ingress only supports a single TLS port, 443. If multiple members of this list specify different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension, if the ingress controller fulfilling the ingress supports SNI.
    */
    'tls'?: Array<V1beta1IngressTLS>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "backend",
            "baseName": "backend",
            "type": "V1beta1IngressBackend"
        },
        {
            "name": "rules",
            "baseName": "rules",
            "type": "Array<V1beta1IngressRule>"
        },
        {
            "name": "tls",
            "baseName": "tls",
            "type": "Array<V1beta1IngressTLS>"
        }    ];

    static getAttributeTypeMap() {
        return V1beta1IngressSpec.attributeTypeMap;
    }
}

