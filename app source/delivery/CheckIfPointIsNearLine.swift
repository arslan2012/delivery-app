//
//  CheckIfPointIsNearLine.swift
//  delivery
//
//  Created by Arslan Ablikim on 4/12/17.
//  Copyright © 2017 Arslan Ablikim. All rights reserved.
//

import Foundation

func CheckIfPointIsNearLine(_ point1: (x: Double, y: Double),
                            _ point2: (x: Double, y: Double),
                            pointToCheck: (x: Double, y: Double),
                            maxDistance: Double) -> Bool {
    let realDistance = pointDistanceToLine(point1, point2, pointToCheck: pointToCheck)
    return realDistance < maxDistance
}

func pointDistanceToLine(_ point1: (x: Double, y: Double),
                         _ point2: (x: Double, y: Double),
                         pointToCheck: (x: Double, y: Double)) -> Double {
    let dist1 = distanceBetweenPoints(point1, pointToCheck)
    let dist2 = distanceBetweenPoints(point2, pointToCheck)
    let projectDist = dist1 + (dist2 - dist1) / 2
    return sqrt(abs(pow(dist1, 2) - pow(projectDist, 2)))
}

func distanceBetweenPoints(_ point1: (x: Double, y: Double), _ point2: (x: Double, y: Double)) -> Double {
    return hypot(point1.x - point2.x, point1.y - point2.y)
}
