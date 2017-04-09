//
//  delivertJobClass.swift
//  delivery
//
//  Created by Arslan Ablikim on 4/9/17.
//  Copyright © 2017 Arslan Ablikim. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

public class deliveryJob {
    private var id: Int32
    private(set) public var address: String
    private var longitude: Double
    private var latitude: Double
    private init(id: Int32, address: String, longitude: Double, latitude: Double) {
        self.id = id
        self.address = address
        self.longitude = longitude
        self.latitude = latitude
    }
    private init(fromJSON json: JSON) {
        self.id = json["id"].int32Value
        self.address = json["address"].stringValue
        self.longitude = json["longitude"].doubleValue
        self.latitude = json["latitude"].doubleValue
    }

    class func verifyThenCreate(_ ObjectString: String, handler: @escaping (_ result: deliveryJob?) -> Void) {
        if let dataFromString = ObjectString.data(using: .utf8, allowLossyConversion: false) {
            let qrJson = JSON(data: dataFromString)
            let id = qrJson["id"].stringValue
            if id == "" {
                print("incorrect QR code error1")
                // TODO incorrect QR code error
            }
            Alamofire.request(getServerFromInfoPlist() + "/api/delivery-jobs/" + id)
                    .validate(statusCode: 200..<300)
                    .responseJSON { response in
                        if response.result.isFailure {
                            print("incorrect server config error")
                            // TODO incorrect server config error
                        }
                        if let resultJsonValue = response.result.value {
                            let resultJson = JSON(resultJsonValue)
                            print(resultJson["id"].stringValue)
                            if qrJson["address"].stringValue == resultJson["address"].stringValue,
                               qrJson["longitude"].doubleValue - resultJson["longitude"].doubleValue < 1e-6,
                               qrJson["latitude"].doubleValue - resultJson["latitude"].doubleValue < 1e-6 {
                                handler(deliveryJob(fromJSON: qrJson))
                            } else {
                                print("incorrect data error2")
                                // TODO incorrect data error
                            }
                        }
                    }
        } else {
            print("incorrect QR code error2")
            // TODO incorrect QR code error
        }
    }
}
