#!/usr/bin/env python3
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STARTER = ROOT / "maps" / "starter-kit" / "office.tmj"
OUTPUT = ROOT / "maps" / "starter-kit" / "vr-office.tmj"

TILE = 32

# Planta em coordenadas de tiles. A geometria foi pensada para priorizar
# circulação interna simples e leitura imediata dos ambientes.
ROOMS = [
    ("ceo_victor_romero", 1, 1, 8, 5, "Sala CEO — Victor Romero"),
    ("diretor_audiovisual", 10, 1, 8, 5, "Sala Diretor Audiovisual"),
    ("producao", 20, 1, 10, 5, "Produção — 3 mesas"),
    ("privativa_01", 1, 7, 5, 3, "Privativa 01"),
    ("privativa_02", 1, 10, 5, 3, "Privativa 02"),
    ("privativa_03", 1, 13, 5, 3, "Privativa 03"),
    ("privativa_04", 1, 16, 5, 3, "Privativa 04"),
    ("corredor_central", 7, 7, 15, 12, "Corredor Central"),
    ("convivencia", 23, 7, 7, 6, "Área de Convivência"),
    ("auditorio", 23, 14, 7, 5, "Auditório"),
    ("recepcao", 7, 17, 15, 3, "Recepção / Entrada"),
]

# Portas em coordenadas de tiles. A porta do auditório é obrigatoriamente
# interna, conectada ao corredor central.
DOORS = [
    ("porta_ceo", 7, 6, "CEO → corredor"),
    ("porta_audiovisual", 15, 6, "Audiovisual → corredor"),
    ("porta_producao", 23, 6, "Produção → corredor"),
    ("porta_privativa_01", 6, 8, "Privativa 01 → corredor"),
    ("porta_privativa_02", 6, 11, "Privativa 02 → corredor"),
    ("porta_privativa_03", 6, 14, "Privativa 03 → corredor"),
    ("porta_privativa_04", 6, 17, "Privativa 04 → corredor"),
    ("porta_convivencia", 22, 10, "Convivência → corredor"),
    ("porta_auditorio_interna", 22, 16, "Auditório → corredor interno"),
]


def rect_object(obj_id, name, tx, ty, tw, th, label):
    return {
        "id": obj_id,
        "name": name,
        "type": "vr-room-guide",
        "x": tx * TILE,
        "y": ty * TILE,
        "width": tw * TILE,
        "height": th * TILE,
        "rotation": 0,
        "visible": True,
        "properties": [
            {"name": "vrRoomId", "type": "string", "value": name},
            {"name": "label", "type": "string", "value": label},
        ],
    }


def door_object(obj_id, name, tx, ty, label):
    return {
        "id": obj_id,
        "name": name,
        "type": "vr-door-guide",
        "x": tx * TILE,
        "y": ty * TILE,
        "width": TILE,
        "height": TILE,
        "rotation": 0,
        "visible": True,
        "properties": [
            {"name": "label", "type": "string", "value": label},
        ],
    }


def main():
    if not STARTER.exists():
        raise SystemExit(
            "Starter kit não encontrado. Execute primeiro: ./scripts/bootstrap-map-starter-kit.sh"
        )

    with STARTER.open("r", encoding="utf-8") as f:
        base = json.load(f)

    data = copy.deepcopy(base)

    # Remove uma versão anterior da nossa camada-guia para permitir reexecução.
    data["layers"] = [
        layer for layer in data.get("layers", [])
        if layer.get("name") not in {"VR_LAYOUT_GUIDE", "VR_DOORS_GUIDE"}
    ]

    max_layer_id = max((layer.get("id", 0) for layer in data.get("layers", [])), default=0)
    next_object_id = int(data.get("nextobjectid", 1))

    room_objects = []
    for room in ROOMS:
        name, x, y, w, h, label = room
        room_objects.append(rect_object(next_object_id, name, x, y, w, h, label))
        next_object_id += 1

    door_objects = []
    for door in DOORS:
        name, x, y, label = door
        door_objects.append(door_object(next_object_id, name, x, y, label))
        next_object_id += 1

    data["layers"].append({
        "id": max_layer_id + 1,
        "name": "VR_LAYOUT_GUIDE",
        "type": "objectgroup",
        "opacity": 0.55,
        "visible": True,
        "draworder": "topdown",
        "x": 0,
        "y": 0,
        "objects": room_objects,
        "properties": [
            {"name": "purpose", "type": "string", "value": "Guia da planta V1. Converter em paredes/pisos antes do acabamento final."}
        ],
    })

    data["layers"].append({
        "id": max_layer_id + 2,
        "name": "VR_DOORS_GUIDE",
        "type": "objectgroup",
        "opacity": 0.9,
        "visible": True,
        "draworder": "topdown",
        "x": 0,
        "y": 0,
        "objects": door_objects,
    })

    data["nextlayerid"] = max(int(data.get("nextlayerid", 1)), max_layer_id + 3)
    data["nextobjectid"] = next_object_id

    # Metadados do nosso projeto.
    props = [p for p in data.get("properties", []) if p.get("name") not in {
        "vrProject", "vrVersion", "vrAuditórioAcessoInterno"
    }]
    props.extend([
        {"name": "vrProject", "type": "string", "value": "Escritório Virtual VR"},
        {"name": "vrVersion", "type": "string", "value": "V1-layout"},
        {"name": "vrAuditórioAcessoInterno", "type": "bool", "value": True},
    ])
    data["properties"] = props

    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Planta-guia gerada: {OUTPUT}")
    print("Abra vr-office.tmj no Tiled e deixe VR_LAYOUT_GUIDE / VR_DOORS_GUIDE visíveis.")
    print("A porta 'porta_auditorio_interna' marca o acesso obrigatório pelo corredor interno.")


if __name__ == "__main__":
    main()
