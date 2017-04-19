//
//  getServerFromInfoPlist.swift
//  delivery
//
//  Created by Arslan Ablikim on 4/9/17.
//  Copyright © 2017 Arslan Ablikim. All rights reserved.
//

import Foundation
func getServerFromInfoPlist() -> String{
	if let path = Bundle.main.path(forResource: "Info", ofType: "plist"),
		let dict = NSDictionary(contentsOfFile: path) as? [String: AnyObject]  {
		return dict["Server Host Name"] as! String
	} else {
		return ""
	}
}
