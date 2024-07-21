// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::collections::BinaryHeap;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Clone)]
struct State {
    cost: u16,
    position: usize,
    tiles: Vec<u8>,
}

// Implementing PartialEq for State struct
impl PartialEq for State {
    fn eq(&self, other: &Self) -> bool {
        self.tiles == other.tiles
    }
}

// Implementing Eq for State struct
impl Eq for State {}

// Implementing PartialOrd for State struct
impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

// Implementing Ord for State struct
impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

fn heuristic(tiles: &Vec<u8>, goal: &Vec<u8>) -> u16 {
    let size = (tiles.len() as f64).sqrt() as usize;
    let mut distance = 0;
    for i in 0..(size*size) {
        let start_x = i % size;
        let start_y = i / size;
        let e = tiles[i];
        let goal_i = goal.iter().position(|&x| x==e).unwrap();
        let goal_x = goal_i % size;
        let goal_y = goal_i / size;
        distance += (goal_x as isize - start_x as isize).abs() + (goal_y as isize - start_y as isize).abs();
    }
    distance as u16
}

#[tauri::command]
fn solve_puzzle(tiles: Vec<u8>) -> Vec<u8> {
    println!("Search started");
    let size = (tiles.len() as f64).sqrt() as usize;
    if size>5 {
        println!("Warning: puzzles greater than 5x5 may cause heuristic overflow")
    }
    let goal = State { cost: 0, position: size*size - 1, tiles: (1..(size*size)).map(|x| x as u8).chain(std::iter::once(0)).collect() };
    let start = State { cost: heuristic(&tiles, &goal.tiles), position: tiles.iter().position(|&x| x == 0).unwrap(), tiles: tiles.clone() };

    let mut heap = BinaryHeap::new();
    heap.push(start.clone());

    let mut came_from: HashMap<Vec<u8>, (State, u8)> = HashMap::new();

    let mut iteration = 0;
    let mut closed_set: HashSet<Vec<u8>> = HashSet::new();
    while let Some(State { cost, position, tiles }) = heap.pop() {
        if !closed_set.insert(tiles.clone()) {
            continue;
        }
        iteration += 1;
        if iteration % 10000 == 0 { // Adjust this number as needed
            let min_cost = heap.iter().map(|state| state.cost).min().unwrap_or(0);
            let max_cost = heap.iter().map(|state| state.cost).max().unwrap_or(0);
            println!("Iteration: {}, Heap size: {}, came_from size: {}, Min cost: {}, Max cost: {}", iteration, heap.len(), came_from.len(), min_cost, max_cost);
        }
        if tiles == goal.tiles {
            let mut path = Vec::new();
            let mut current = tiles;
            while current != start.tiles {
                let (prev, dir) = &came_from[&current];
                path.push(*dir);
                current = prev.tiles.clone();
            }
            path.reverse();
            return path;
        }

        for &(dx, dy, dir) in &[(0, -1, 0), (1, 0, 1), (0, 1, 2), (-1, 0, 3)] {
            let nx = (position as isize % size as isize + dx as isize) as usize;
            let ny = (position as isize / size as isize + dy as isize) as usize;
            if nx < size && ny < size {
                let new_position = nx + ny * size;
                let mut new_tiles = tiles.clone();
                new_tiles.swap(position, new_position);
                let new_cost: u16 = cost + 1;
                let h: u16 = heuristic(&new_tiles, &goal.tiles);
                let new_state = State { cost: new_cost + h, position: new_position, tiles: new_tiles };
                if !came_from.contains_key(&new_state.tiles) || new_state.cost < came_from[&new_state.tiles].0.cost {
                    heap.push(new_state.clone());
                    came_from.insert(new_state.tiles.clone(), (State { cost, position, tiles: tiles.clone() }, dir));
                }
            }
        }
    }

    vec![]
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![solve_puzzle])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
