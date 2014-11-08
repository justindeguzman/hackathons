//
//  CheckoutViewController.swift
//  Wiwo
//
//  Created by Justin de Guzman on 11/1/14.
//  Copyright (c) 2014 wiwo. All rights reserved.
//

import UIKit
import AudioToolbox

class CheckoutViewController: UIViewController {
  @IBOutlet var storeTitleLabel: UILabel!
  @IBOutlet var itemsTitleLabel: UILabel!
  @IBOutlet var totalTitleLabel: UILabel!
  
  @IBOutlet var storeLabel: UILabel!
  @IBOutlet var itemsLabel: UILabel!
  @IBOutlet var totalLabel: UILabel!
  
  @IBOutlet var doneButton: UIButton!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    var pvc = self.presentingViewController as ViewController
    storeLabel.text = pvc.store
    itemsLabel.text = "\(pvc.products.count)"
    
    var priceCount : Int = 0
    
    for product in pvc.products as [String] {
      var price = pvc.prices[product]!.toInt()
      priceCount = priceCount + price!
    }
    
    totalLabel.text = "$\(priceCount).00"
    
    var url = NSURL(string:
      "http://104.236.55.193:3000/purchases?amount=\(priceCount)")
    var request = NSMutableURLRequest(URL: url!)

    NSURLConnection.sendAsynchronousRequest(request, queue:
      NSOperationQueue.mainQueue()) {(response, data, error) in
        
        self.storeTitleLabel.hidden = false
        self.itemsTitleLabel.hidden = false
        self.totalTitleLabel.hidden = false
        
        self.storeLabel.hidden = false
        self.itemsLabel.hidden = false
        self.totalLabel.hidden = false
        
        self.doneButton.hidden = false
        
        AudioServicesPlayAlertSound(SystemSoundID(1025))
    }
  }
  
  @IBAction func close() {    
    self.presentingViewController?.dismissViewControllerAnimated(
      true, completion: {
    })
  }
}
