from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db

from models.company import Company
from models.carbon import CarbonRecord
from models.esg_input import ESGInput
from models.esg import ESGScore

from services.esg_service import ESGCalculator


esg_bp = Blueprint("esg", __name__)


# ============================================================
# Save ESG Input + Generate ESG Score
# ============================================================

@esg_bp.route("/", methods=["POST"])
@jwt_required()
def generate_esg():

    try:

        user_id = get_jwt_identity()

        data = request.get_json() or {}

        company = Company.query.filter_by(
            user_id=user_id
        ).first()

        if not company:

            return jsonify({
                "success": False,
                "message": "Company not found"
            }), 404

        # ----------------------------------------------------
        # Get Latest Carbon Record
        # ----------------------------------------------------

        carbon = CarbonRecord.query.filter_by(
            company_id=company.id
        ).order_by(
            CarbonRecord.created_at.desc()
        ).first()

        if not carbon:

            return jsonify({
                "success": False,
                "message": "Please calculate Carbon Emission first."
            }), 400

        # ----------------------------------------------------
        # Save ESG Input
        # ----------------------------------------------------

        esg_input = ESGInput(

            company_id=company.id,

            renewable_energy=data.get(
                "renewable_energy",
                0
            ),

            water_consumption=data.get(
                "water_consumption",
                0
            ),

            recycling_rate=data.get(
                "recycling_rate",
                0
            ),

            environmental_policy=data.get(
                "environmental_policy",
                False
            ),

            employee_satisfaction=data.get(
                "employee_satisfaction",
                0
            ),

            training_hours=data.get(
                "training_hours",
                0
            ),

            gender_diversity=data.get(
                "gender_diversity",
                0
            ),

            community_projects=data.get(
                "community_projects",
                False
            ),

            board_meetings=data.get(
                "board_meetings",
                0
            ),

            ethics_policy=data.get(
                "ethics_policy",
                False
            ),

            compliance=data.get(
                "compliance",
                False
            ),

            risk_management=data.get(
                "risk_management",
                False
            )
        )

        db.session.add(esg_input)
        db.session.commit()

        # ----------------------------------------------------
        # Calculate ESG
        # ----------------------------------------------------

        result = ESGCalculator.calculate(
            carbon,
            esg_input
        )

        # ----------------------------------------------------
        # Save ESG Score
        # ----------------------------------------------------

        esg = ESGScore(

            company_id=company.id,

            environmental_score=result[
                "environmental_score"
            ],

            social_score=result[
                "social_score"
            ],

            governance_score=result[
                "governance_score"
            ],

            overall_score=result[
                "overall_score"
            ],

            environmental_status=result[
                "environmental_status"
            ],

            social_status=result[
                "social_status"
            ],

            governance_status=result[
                "governance_status"
            ],

            overall_status=result[
                "overall_status"
            ],

            environmental_remark=result[
                "environmental_remark"
            ],

            social_remark=result[
                "social_remark"
            ],

            governance_remark=result[
                "governance_remark"
            ],

            overall_remark=result[
                "overall_remark"
            ],

            recommendations=result[
                "recommendations"
            ]
        )

        db.session.add(esg)
        db.session.commit()

        return jsonify({

            "success": True,

            "message":
                "ESG Score Generated Successfully",

            "data": result

        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# ============================================================
# Get ESG Score History
# ============================================================

@esg_bp.route("/", methods=["GET"])
@jwt_required()
def get_esg_history():

    try:

        user_id = get_jwt_identity()

        company = Company.query.filter_by(
            user_id=user_id
        ).first()

        if not company:

            return jsonify({
                "success": False,
                "message": "Company not found"
            }), 404

        scores = ESGScore.query.filter_by(
            company_id=company.id
        ).order_by(
            ESGScore.created_at.asc()
        ).all()

        data = []

        for score in scores:

            data.append({

                "id":
                    score.id,

                "environmental_score":
                    score.environmental_score,

                "social_score":
                    score.social_score,

                "governance_score":
                    score.governance_score,

                "overall_score":
                    score.overall_score,

                "environmental_status":
                    score.environmental_status,

                "social_status":
                    score.social_status,

                "governance_status":
                    score.governance_status,

                "overall_status":
                    score.overall_status,

                "environmental_remark":
                    score.environmental_remark,

                "social_remark":
                    score.social_remark,

                "governance_remark":
                    score.governance_remark,

                "overall_remark":
                    score.overall_remark,

                "recommendations":
                    score.recommendations,

                "created_at":
                    score.created_at.isoformat()
                    if score.created_at
                    else None
            })

        return jsonify({

            "success": True,

            "data": data

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# ============================================================
# Get Latest ESG Score
# ============================================================

@esg_bp.route("/latest", methods=["GET"])
@jwt_required()
def latest_esg():

    try:

        user_id = get_jwt_identity()

        company = Company.query.filter_by(
            user_id=user_id
        ).first()

        if not company:

            return jsonify({
                "success": False,
                "message": "Company not found"
            }), 404

        latest = ESGScore.query.filter_by(
            company_id=company.id
        ).order_by(
            ESGScore.created_at.desc()
        ).first()

        if not latest:

            return jsonify({
                "success": False,
                "message": "No ESG score found"
            }), 404

        return jsonify({

            "success": True,

            "data": {

                "id":
                    latest.id,

                "environmental_score":
                    latest.environmental_score,

                "social_score":
                    latest.social_score,

                "governance_score":
                    latest.governance_score,

                "overall_score":
                    latest.overall_score,

                "environmental_status":
                    latest.environmental_status,

                "social_status":
                    latest.social_status,

                "governance_status":
                    latest.governance_status,

                "overall_status":
                    latest.overall_status,

                "environmental_remark":
                    latest.environmental_remark,

                "social_remark":
                    latest.social_remark,

                "governance_remark":
                    latest.governance_remark,

                "overall_remark":
                    latest.overall_remark,

                "recommendations":
                    latest.recommendations,

                "created_at":
                    latest.created_at.isoformat()
                    if latest.created_at
                    else None
            }

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500