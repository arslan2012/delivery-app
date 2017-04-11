//
//  ViewController.swift
//  delivery
//
//  Created by Arslan Ablikim on 4/7/17.
//  Copyright © 2017 Arslan Ablikim. All rights reserved.
//

import UIKit
import AVFoundation
import QRCodeReader


enum DeliveryState {
    case startup, jobAcquired, QRscaned, jobStarted
}

class ViewController: UIViewController, QRCodeReaderViewControllerDelegate {
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var idLabel: UILabel!
    @IBOutlet weak var qrScanButton: UIButton!
    @IBOutlet weak var startDeliveryButton: UIButton!
    var currentJob: deliveryJob? = nil
    var currentState: DeliveryState = .startup

    override func viewDidLoad() {
        super.viewDidLoad()
		currentJob = deliveryJob.getFromDatabase()
		if currentJob != nil {
			self.addressLabel.text = self.currentJob!.address
			self.idLabel.text = String(self.currentJob!.id)
		}
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    @IBAction func newJobRequested(_ sender: UIButton) {
        deliveryJob.CreateFromServer() { (result) -> Void in
            self.currentJob = result
            print(self.currentJob!.address)
            self.addressLabel.text = self.currentJob!.address
            self.idLabel.text = String(self.currentJob!.id)
            self.currentState = .jobAcquired
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
                if qrJob == self.currentJob {
                    self.qrScanButton.isHidden = true
                    self.startDeliveryButton.isHidden = false
                    self.currentState = .QRscaned
                }
            }
        }

        // Presents the readerVC as modal form sheet
        readerVC.modalPresentationStyle = .formSheet
        present(readerVC, animated: true, completion: nil)
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


}

