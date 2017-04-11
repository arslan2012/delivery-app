//
//  ViewController.swift
//  delivery
//
//  Created by Arslan Ablikim on 4/7/17.
//  Copyright © 2017 Arslan Ablikim. All rights reserved.
//

import UIKit
import AVFoundation
import CoreLocation
import QRCodeReader

class ViewController: UIViewController, QRCodeReaderViewControllerDelegate, CLLocationManagerDelegate {
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var idLabel: UILabel!
    @IBOutlet weak var qrScanButton: UIButton!
    @IBOutlet weak var startDeliveryButton: UIButton!
    var currentJob: deliveryJob? = nil
	let locationManager = CLLocationManager()

    override func viewDidLoad() {
        super.viewDidLoad()
		//initialize GPS
		locationManager.delegate = self
		locationManager.desiredAccuracy = kCLLocationAccuracyBest
		
		//restore delivery status from local data
		currentJob = deliveryJob.getFromDatabase()
		if currentJob != nil {
			transitToState((currentJob?.stateEnum)!)
		}
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    @IBAction func newJobRequested(_ sender: UIButton) {
        deliveryJob.CreateFromServer() { (result) -> Void in
            self.currentJob = result
            self.transitToState(.jobAcquired)
        }
    }

    @IBAction func scanAction(_ sender: AnyObject) {
        // Retrieve the QRCode content
        // By using the delegate pattern
        readerVC.delegate = self

        // Or by using the closure pattern
        readerVC.completionBlock = { (result: QRCodeReaderResult?) in
            print(result ?? "")
            if let ObjectString = result?.value {
                let qrJob = deliveryJob.CreateFromQR(ObjectString)
                if qrJob! == self.currentJob! {
                    self.transitToState(.QRscaned)
				} else {
				}
            }
        }

        // Presents the readerVC as modal form sheet
        readerVC.modalPresentationStyle = .formSheet
        present(readerVC, animated: true, completion: nil)
    }
	
	@IBAction func startDeliveryClicked(_ sender:AnyObject) {
		transitToState(.jobStarted)
	}
	
	func transitToState(_ state:DeliveryState) {
		switch state {
		case .startup:
			self.addressLabel.text = "暂无"
			self.idLabel.text = "暂无"
			self.qrScanButton.isHidden = false
			self.startDeliveryButton.isHidden = true
			self.currentJob?.stateEnum = .startup
			break
		case .jobAcquired:
			self.addressLabel.text = self.currentJob!.address
			self.idLabel.text = String(self.currentJob!.id)
			self.qrScanButton.isHidden = false
			self.startDeliveryButton.isHidden = true
			self.currentJob?.stateEnum = .jobAcquired
			break
		case .QRscaned:
			self.addressLabel.text = self.currentJob!.address
			self.idLabel.text = String(self.currentJob!.id)
			self.qrScanButton.isHidden = true
			self.startDeliveryButton.isHidden = false
			self.currentJob?.stateEnum = .QRscaned
			break
		case .jobStarted:
			locationManager.requestWhenInUseAuthorization()
			locationManager.startUpdatingLocation()
			self.addressLabel.text = self.currentJob!.address
			self.idLabel.text = String(self.currentJob!.id)
			self.qrScanButton.isHidden = true
			self.startDeliveryButton.isHidden = true
			self.currentJob?.stateEnum = .jobStarted
			break
		}
	}


    // Good practice: create the reader lazily to avoid cpu overload during the
    // initialization and each time we need to scan a QRCode
    lazy var readerVC: QRCodeReaderViewController = {
        let builder = QRCodeReaderViewControllerBuilder {
            $0.reader = QRCodeReader(metadataObjectTypes: [AVMetadataObjectTypeQRCode], captureDevicePosition: .back)
        }

        return QRCodeReaderViewController(builder: builder)
    }()

    // MARK: - QRCodeReaderViewController Delegate Methods

    func reader(_ reader: QRCodeReaderViewController, didScanResult result: QRCodeReaderResult) {
        reader.stopScanning()

        dismiss(animated: true, completion: nil)
    }

    //This is an optional delegate method, that allows you to be notified when the user switches the cameraName
    //By pressing on the switch camera button
    func reader(_ reader: QRCodeReaderViewController, didSwitchCamera newCaptureDevice: AVCaptureDeviceInput) {
        if let cameraName = newCaptureDevice.device.localizedName {
            print("Switching capturing to: \(cameraName)")
        }
    }

    func readerDidCancel(_ reader: QRCodeReaderViewController) {
        reader.stopScanning()

        dismiss(animated: true, completion: nil)
    }
	
	func locationManager(_ manager: CLLocationManager,
	                     didUpdateLocations locations: [CLLocation]){
		let latestLocation = locations[locations.count - 1]
		print(latestLocation.coordinate.longitude)
		print(latestLocation.coordinate.latitude)
	}
	
	func locationManager(_ manager: CLLocationManager,
	                     didFailWithError error: Error) {
		
	}
}

