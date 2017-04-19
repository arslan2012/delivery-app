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
import CoreData

let managedContext = (UIApplication.shared.delegate as! AppDelegate).persistentContainer.viewContext

public enum DeliveryState: Int16 {
    case startup, jobAcquired, QRscaned, jobStarted
}

public class deliveryJob: NSManagedObject {
    @NSManaged private(set) public var id: Int32
    @NSManaged private(set) public var address: String
    @NSManaged private(set) public var longitude: Double
    @NSManaged private(set) public var latitude: Double
    @NSManaged private var state: Int16
    var stateEnum: DeliveryState {                    //  ↓ If self.state is invalid.
        get {
            return DeliveryState(rawValue: self.state) ?? .startup
        }
        set {
            self.state = newValue.rawValue
            do {
                try managedContext.save()
            } catch {
                fatalError("Failure to save context: \(error)")
            }
        }
    }
    public convenience init(fromJSON json: JSON) {
        let entity = NSEntityDescription.entity(forEntityName: "DeliveryJob", in: managedContext)!
        self.init(entity: entity, insertInto: managedContext)
        self.id = json["id"].int32Value
        self.address = json["address"].stringValue
        self.longitude = json["longitude"].doubleValue
        self.latitude = json["latitude"].doubleValue
        self.stateEnum = .startup
    }

    class func CreateFromQR(_ ObjectString: String) -> deliveryJob? {
        if let dataFromString = ObjectString.data(using: .utf8, allowLossyConversion: false) {
            let qrJson = JSON(data: dataFromString)
            let id = qrJson["id"].stringValue
            if id == "" {
                print("incorrect QR code error1")
                // TODO incorrect QR code error
                return nil
            } else {
                return deliveryJob(fromJSON: qrJson)
            }
        } else {
            print("incorrect QR code error2")
            // TODO incorrect QR code error
            return nil
        }
    }

    class func CreateFromServer(handler: @escaping (_ result: deliveryJob?) -> Void) {
        Alamofire.request(getServerFromInfoPlist() + "/api/delivery-jobs/get-new")
                .validate(statusCode: 200..<300)
                .responseJSON { response in
                    if response.result.isFailure {
                        print("incorrect server config error")
                        // TODO incorrect server config error
                        handler(nil)
                    }
                    if let resultJsonValue = response.result.value {
                        let resultJson = JSON(resultJsonValue)
                        print(resultJson["id"].stringValue)
                        let result = deliveryJob(fromJSON: resultJson)
                        do {
                            try managedContext.save()
                        } catch {
                            fatalError("Failure to save context: \(error)")
                        }
                        handler(result)
                    } else {
                        handler(nil)
                    }
                }
    }

    class func getFromDatabase() -> deliveryJob? {
        var result: deliveryJob? = nil
        do {
			let results = try managedContext.fetch(NSFetchRequest(entityName: "DeliveryJob"))
			if results.count > 0 {
				result = results[0] as? deliveryJob
			}
        } catch let error as NSError {
            print("Could not fetch. \(error), \(error.userInfo)")
        }
        return result
    }
	
	class func clearAll() {
		let fetch = NSFetchRequest<NSFetchRequestResult>(entityName: "DeliveryJob")
		let deleteRequest = NSBatchDeleteRequest(fetchRequest: fetch)
		do {
			try managedContext.execute(deleteRequest)
			try managedContext.save()
		} catch {
			print ("There was an error")
		}
	}

    public static func ==(lhs: deliveryJob, rhs: deliveryJob) -> Bool {
        return lhs.id == rhs.id &&
                lhs.address == rhs.address &&
                (lhs.longitude - rhs.longitude < 1e-6) &&
                (lhs.latitude - rhs.latitude < 1e-6)
    }
}
