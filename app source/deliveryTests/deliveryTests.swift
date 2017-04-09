//
//  deliveryTests.swift
//  deliveryTests
//
//  Created by Arslan Ablikim on 4/7/17.
//  Copyright © 2017 Arslan Ablikim. All rights reserved.
//

import XCTest
@testable import delivery

class deliveryTests: XCTestCase {
	var vc: ViewController!
    
    override func setUp() {
        super.setUp()
		let storyboard = UIStoryboard(name: "Main", bundle: Bundle.main)
		vc = storyboard.instantiateInitialViewController() as! ViewController
    }
	
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
//	func testGettingServer() {
//		let host = delivery.getServerFromInfoPlist()
//		XCTAssert(host.length > 0)
//	}
	
}
